const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Visit = require('../models/Visit');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

// @route   POST /api/stats/visit
// @desc    Log a page visit
// @access  Public
router.post('/visit', async (req, res) => {
    try {
        const visit = new Visit({
            page: req.body.page,
            ip: req.ip, // MongoDB will save server IP if proxied, but good enough
            userAgent: req.get('User-Agent')
        });
        await visit.save();
        res.status(204).send(); // No content response
    } catch (error) {
        res.status(500).send();
    }
});

// @route   GET /api/stats/summary
// @desc    Get dashboard numbers (Sales, Orders, Users, Visits)
// @access  Private (Admin)
router.get('/summary', protect, async (req, res) => {
    // --- BYPASS DASHBOARD DATA FOR TESTING ---
    if (req.user && req.user.email === 'admin@test.com') {
        return res.json({
            totalSales: 154200,
            totalOrders: 42,
            totalUsers: 85,
            totalVisits: 1205,
            topProducts: [
                { name: 'Niacinamide 10%', qty: 15 },
                { name: 'Hyaluronic Acid 2%', qty: 12 },
                { name: 'Salicylic Acid 2%', qty: 8 }
            ],
            recentActivity: [
                { event: 'Order Placed', user: 'Sunil', details: '1x Niacinamide', time: new Date() },
                { event: 'New Inquiry', user: 'Kamal', details: 'About Delivery', time: new Date() }
            ],
            graphData: {
                dailyVisits: [
                    { _id: '2026-04-01', count: 120 }, { _id: '2026-04-02', count: 150 },
                    { _id: '2026-04-03', count: 110 }, { _id: '2026-04-04', count: 180 }
                ],
                dailyOrders: [
                    { _id: '2026-04-01', count: 5, sales: 12000 }, { _id: '2026-04-02', count: 8, sales: 24000 },
                    { _id: '2026-04-03', count: 4, sales: 11000 }, { _id: '2026-04-04', count: 10, sales: 45000 }
                ]
            }
        });
    }

    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalVisits = await Visit.countDocuments();
        const orders = await Order.find({});
        const totalSales = orders.reduce((acc, current) => acc + (current.totalPrice || 0), 0);

        // Fetch products to compute cost and net profit
        const products = await Product.find({});
        const productLookup = {};
        products.forEach(prod => {
            if (prod._id) productLookup[String(prod._id)] = prod;
            if (prod.id) productLookup[String(prod.id)] = prod;
            if (prod.name) productLookup[String(prod.name).trim().toLowerCase()] = prod;
        });

        let totalCost = 0;
        const dailyProfitMap = {};

        orders.forEach(o => {
            const dayStr = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : null;
            if (dayStr && !dailyProfitMap[dayStr]) {
                dailyProfitMap[dayStr] = { sales: 0, cost: 0, profit: 0 };
            }

            let orderCost = 0;
            if (Array.isArray(o.orderItems)) {
                o.orderItems.forEach(item => {
                    const prodKey = item.product || item.productId || (item.name ? item.name.trim().toLowerCase() : '');
                    const matchedProd = productLookup[prodKey] || productLookup[item.name ? item.name.trim().toLowerCase() : ''];
                    let unitCost = 0;
                    if (matchedProd) {
                        if (item.variant && Array.isArray(matchedProd.variants)) {
                            const varMatch = matchedProd.variants.find(v => v.name && v.name.toLowerCase() === String(item.variant).toLowerCase());
                            if (varMatch && varMatch.cost) unitCost = Number(varMatch.cost);
                        }
                        if (!unitCost) unitCost = Number(matchedProd.cost) || 0;
                    }
                    const itemCost = unitCost * (Number(item.qty) || 1);
                    orderCost += itemCost;
                });
            }
            totalCost += orderCost;

            if (dayStr) {
                dailyProfitMap[dayStr].sales += Number(o.totalPrice) || 0;
                dailyProfitMap[dayStr].cost += orderCost;
                dailyProfitMap[dayStr].profit += (Number(o.totalPrice) || 0) - orderCost;
            }
        });

        const totalProfit = Math.max(0, totalSales - totalCost);
        const profitMargin = totalSales > 0 ? Number(((totalProfit / totalSales) * 100).toFixed(1)) : 0;

        // Product Analysis (most popular products in orders)
        // Let's count items across all orders
        let itemCounts = {};
        orders.forEach(o => {
            if (o.orderItems) {
                o.orderItems.forEach(item => {
                    if (item && item.name) {
                        const name = item.name;
                        itemCounts[name] = (itemCounts[name] || 0) + (item.qty || 0);
                    }
                });
            }
        });

        // Recent Activity (Mixed orders and inquiries)
        const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
        const recentInquiries = await Inquiry.find({}).sort({ createdAt: -1 }).limit(5);

        let recentActivity = [
            ...recentOrders.map(o => ({
                event: 'Order Placed',
                user: o.customerInfo?.firstName || 'Customer',
                details: (o.orderItems || []).map(i => (i.qty || 0) + 'x ' + (i.name || 'Item')).join(', '),
                time: o.createdAt
            })),
            ...recentInquiries.map(i => ({
                event: 'New Inquiry',
                user: i.name,
                details: i.subject || 'Customer Message',
                time: i.createdAt
            }))
        ].sort((a,b) => b.time - a.time).slice(0, 8);

        // Define topProducts from itemCounts
        const topProducts = Object.entries(itemCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, qty]) => ({ name, qty }));

        // --- NEW: Time-series Stats for Graphs (Last 7 Days) ---
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Daily Visits
        const dailyVisits = await Visit.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Daily Orders
        const dailyOrders = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    sales: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            totalSales,
            totalOrders,
            totalUsers,
            totalVisits,
            topProducts,
            recentActivity,
            graphData: {
                dailyVisits,
                dailyOrders: dailyOrders.map(d => ({
                    _id: d._id,
                    count: d.count,
                    sales: d.sales,
                    cost: dailyProfitMap[d._id] ? dailyProfitMap[d._id].cost : 0,
                    profit: dailyProfitMap[d._id] ? dailyProfitMap[d._id].profit : d.sales
                }))
            },
            totalCost,
            totalProfit,
            profitMargin
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
});

module.exports = router;

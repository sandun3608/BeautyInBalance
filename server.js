app.get('/api/status', async (req, res) => {
    // Wait for DB connection if not connected
    if (mongoose.connection.readyState !== 1) {
        try {
            await connectDB();
        } catch(e) {}
    }
    res.json({ 
        online: true, 
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        env: process.env.NODE_ENV || 'development'
    });
});

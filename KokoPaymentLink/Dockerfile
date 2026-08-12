FROM php:8.2-apache

# Enable Apache mod_rewrite (optional but good practice)
RUN a2enmod rewrite

# Copy all files from the current directory to the Apache web root
COPY . /var/www/html/

# Make sure the web server has permission to write to the orders.json file
RUN chown -R www-data:www-data /var/www/html/
RUN chmod -R 755 /var/www/html/

EXPOSE 80

# Use an official Nginx image
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your static website files to Nginx's web directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
# Stage 1: Build the React Application
FROM node:20 as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --force

# Copy application code and build
COPY . .

# Bypass ignored .env files by hardcoding the Vite router proxy
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx Server
CMD ["nginx", "-g", "daemon off;"]

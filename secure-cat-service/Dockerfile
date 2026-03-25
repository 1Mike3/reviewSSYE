FROM node:20-alpine

# Install OpenSSL for generating self-signed certs
RUN apk update && apk add --no-cache openssl

WORKDIR /usr/src/app

# Create images directory
RUN mkdir -p images

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY . .

# Environment Defaults updated to 5501 and 5500 respectively
ENV PORT=5501
ENV NODE_ENV=production
ENV AUTH_SERVICE_URL=http://host.docker.internal:5500

# Generate Self-Signed Certs if they don't exist, then start
CMD ["sh", "-c", "if [ ! -f cert.key ]; then openssl req -x509 -newkey rsa:4096 -keyout cert.key -out cert.crt -days 365 -nodes -subj '/CN=localhost'; fi && npm start"]

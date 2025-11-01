# Step 1: Base image
FROM node:18-alpine

# Step 2: Working directory
WORKDIR /app

# Step 3: Copy package files aur install dependencies
COPY package*.json ./
RUN npm install --production

# Step 4: Copy all source code
COPY . .

# Step 5: Expose port
EXPOSE 3000

# Step 6: Run the app
CMD ["node", "app.js"]

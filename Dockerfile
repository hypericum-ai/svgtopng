FROM node:24-bullseye

# Install Chromium, Python3 and pip
RUN apt-get update && apt-get install -y chromium python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

RUN pip3 install colorcet seaborn

# Create an unprivileged user
RUN useradd -m -s /bin/bash appuser

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install
RUN rm -rf node_modules/cheerio package-lock.json
RUN npm install --save cheerio@1.0.0-rc.11
RUN npm install --save marked

# Change ownership of app to the new user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose app port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

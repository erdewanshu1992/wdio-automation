# Use Node.js 18 as base image
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies for Android testing
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    curl \
    gnupg \
    software-properties-common \
    openjdk-11-jdk \
    && rm -rf /var/lib/apt/lists/*

# Install Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/tools.zip && \
    unzip /tmp/tools.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm /tmp/tools.zip

# Accept Android SDK licenses
RUN yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

# Install Android SDK components
RUN $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
    "platform-tools" \
    "platforms;android-29" \
    "system-images;android-29;google_apis;x86" \
    "emulator"

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy source code
COPY . .

# Create directories for test results
RUN mkdir -p test-results/screenshots test-results/junit logs screenshots

# Set environment variables
ENV ENVIRONMENT=local
ENV PLATFORM=android
ENV NODE_ENV=test

# Expose Appium port
EXPOSE 4723

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:4723/status || exit 1

# Default command
CMD ["npm", "run", "test:ci"]
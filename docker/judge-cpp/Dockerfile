# Use a modern GCC base
FROM gcc:12.2.0

# Install time (for measuring) and dos2unix (for line endings)
RUN apt-get update && \
    apt-get install -y time dos2unix && \
    rm -rf /var/lib/apt/lists/*

# Copy judge script into a location NOT overwritten by mounts
COPY runner.sh /usr/local/bin/judge-runner.sh

# Ensure Unix line endings + executable bit
RUN dos2unix /usr/local/bin/judge-runner.sh && \
    chmod +x /usr/local/bin/judge-runner.sh

# Set the working directory for user code
WORKDIR /usr/src/app

# When the container runs, invoke our script
ENTRYPOINT ["/usr/local/bin/judge-runner.sh"]

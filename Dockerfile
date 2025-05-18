# Dockerfile for ByteJudge C code runner
FROM gcc:latest

# Working dir inside container
WORKDIR /app

# Copy in the runner script
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

# Set default command
CMD ["/app/run.sh"]

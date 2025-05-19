# Use the official Python image as a parent image
FROM python:3.13-slim

# Install GNU time for memory tracking
RUN apt-get update && apt-get install -y time

# Create a clean runner dir and copy the script there
WORKDIR /runner
COPY run.sh /runner/run.sh
RUN chmod +x /runner/run.sh

# Default working dir (you'll mount /app later)
WORKDIR /app

# Set default command
CMD ["/runner/run.sh"]

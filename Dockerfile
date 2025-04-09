FROM python:3.8.20-slim


WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY . /app/cropontology

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh


WORKDIR /app/cropontology


# Create a virtual environment in the container
RUN python -m venv /app/cropontvenv

# Install dependencies from requirements.txt (if available)
RUN /app/cropontvenv/bin/pip install --no-cache-dir -r requirements.txt

# Install the cropontology package in the virtual environment
RUN /app/cropontvenv/bin/pip install -e .

# Expose port 5900 to run the app
EXPOSE 5900

# Set environment variables to use the virtual environment
ENV PATH="/app/cropontvenv/bin:$PATH"

# Run the application using pserve
CMD ["sh", "-c", "./wait-for-it.sh coneo4j 7474 -- ./wait-for-it.sh comongodb 27017 -- ./wait-for-it.sh coes01 9200 -- ./wait-for-it.sh coes02 9200 -- pserve development.ini"]




# Build stage
FROM golang:1.20-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o auth_service

# Runtime stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/auth_service .

# Copy your .env file if necessary
# COPY .env ./

# Create a directory for SQLite database
RUN mkdir /data
WORKDIR /data

# Expose the port your Go app listens on
EXPOSE 8080

# Define environment variables if needed
# ENV DATABASE_URL=/data/auth.db

CMD ["/app/auth_service"]

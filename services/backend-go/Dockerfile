FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install dependencies for building
RUN apk add --no-cache git

# Copy mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o backend-go ./cmd/server

# Use a minimal alpine image for the final stage
FROM alpine:3.19

WORKDIR /app

# Add ca-certificates for outbound HTTPS requests if needed
RUN apk add --no-cache ca-certificates tzdata

# Create data directory for JSONL storage (if used)
RUN mkdir -p /app/data && chown -R 1000:1000 /app/data

# Copy binary from builder
COPY --from=builder /app/backend-go .

# Ensure non-root execution for security
USER 1000:1000

# Set default port
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["./backend-go"]

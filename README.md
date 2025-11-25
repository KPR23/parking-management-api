# Parking Management API

A robust NestJS-based backend application for managing parking lots, including features for cameras, gates, payments, and subscriptions.

## 🚀 Features

- **Parking Lot Management**: Manage parking spots, pricing, and locations.
- **Gate Control**: Simulate entry and exit gates with device integration.
- **Camera Events**: Handle license plate recognition events (ALPR).
- **Ticket System**: Issue and track parking tickets.
- **Payments**: Process payments for parking sessions.
- **Subscriptions**: Manage monthly, yearly, and lifetime parking subscriptions.
- **Cars**: Register and manage vehicles.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Documentation**: Swagger (OpenAPI)
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm

## 📦 Setup

### Prerequisites

- Node.js (v20+)
- Docker & Docker Compose
- pnpm (`npm install -g pnpm`)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/KPR23/parking-management-api
    cd parking-management-api
    ```

2.  Install dependencies:

    ```bash
    make install
    # or
    pnpm install
    ```

3.  Set up environment variables:
    Copy `.env.example` to `.env` (if available) or ensure the following variables are set:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nest_db?schema=public"
    ```

### Running the Application

#### Using Docker (Recommended)

Start the database and application using Docker Compose:

```bash
make up
# or
docker-compose up -d
```

#### Local Development

1.  Start the database (if not using Docker for the app):

    ```bash
    docker-compose up -d db
    ```

2.  Run database migrations:

    ```bash
    pnpm prisma migrate dev
    ```

3.  Start the application:
    ```bash
    pnpm run start:dev
    ```

## 📚 API Documentation

Once the application is running, you can access the Swagger API documentation at:

[http://localhost:8000/api](http://localhost:8000/api)

## 🛠️ Commands (Makefile)

This project includes a `Makefile` for common tasks:

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `make install`   | Install dependencies            |
| `make up`        | Start services (Docker)         |
| `make down`      | Stop services                   |
| `make logs`      | View application logs           |
| `make db-studio` | Open Prisma Studio to view data |
| `make lint`      | Run linter                      |
| `make build`     | Build the project               |

## 🧪 Testing

# _Note: Tests are currently being implemented._

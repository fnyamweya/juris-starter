# Juris Legal Practice Management Platform

A comprehensive, production-ready NestJS monorepo for legal practice management, featuring microservices architecture with TypeORM, Apache Pulsar event bus, Docker support, and more.

## 🏗️ Monorepo Structure

```
juris/
├── packages/                   # Shared libraries
│   ├── core/                  # Core utilities, interfaces, DTOs
│   ├── database/              # Database configurations, base entities
│   ├── common/                # Common filters, interceptors, utils
│   └── events/                # Event bus with Apache Pulsar
├── apps/                      # Frontend applications (future)
├── services/                  # Microservices
│   ├── cias/                  # Platform + Identity Service (Port 3001)
│   ├── hub/                   # Practice Domain Service (Port 3002)
│   ├── vault/                 # Documents Service (Port 3003)
│   ├── comms/                 # Communications Service (Port 3004)
│   ├── billing/               # Billing & AR Service (Port 3005)
│   ├── siem/                  # Search & Analytics Service (Port 3006)
│   └── guard/                 # Governance Service (Port 3007)
├── docker/                    # Docker configurations
├── docker-compose.yml         # Docker Compose for all services
├── package.json               # Root package.json with workspaces
├── tsconfig.json              # Root TypeScript configuration
└── nest-cli.json              # NestJS CLI monorepo configuration
```

## 🚀 Microservices

| Service | Description | Port |
|---------|-------------|------|
| **cias** | Platform + Identity - Core platform functionality and user identity management | 3001 |
| **hub** | Practice Domain - Legal practice management features | 3002 |
| **vault** | Documents - Document management and storage | 3003 |
| **comms** | Communications - Messaging, notifications, and email | 3004 |
| **billing** | Billing & AR - Invoicing, payments, and accounts receivable | 3005 |
| **siem** | Search & Analytics - Search functionality and analytics | 3006 |
| **guard** | Governance - Compliance, policies, and governance | 3007 |

## 🚀 Features

### Core Features

- **NestJS Framework** - Modern Node.js framework for building scalable server-side applications
- **TypeORM Integration** - Powerful ORM with PostgreSQL support
- **Apache Pulsar Event Bus** - Distributed messaging for microservices communication
- **Docker Support** - Full Docker Compose setup for development and production
- **JWT Authentication** - Secure authentication with access and refresh tokens
- **Role-Based Access Control (RBAC)** - Flexible permission system with roles and permissions
- **Two-Factor Authentication (2FA)** - Enhanced security with TOTP support
- **Activity Logging** - Comprehensive user activity tracking and audit trails
- **File Upload Support** - AWS S3/MinIO integration for file storage
- **Email Service** - SMTP configuration for transactional emails
- **Redis Caching** - High-performance caching layer
- **Winston Logging** - Advanced logging with daily rotation

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose (recommended)
- Or manually: PostgreSQL, Apache Pulsar, Redis, MinIO/S3

## 🐳 Quick Start with Docker

The easiest way to run all services:

```bash
# Clone the repository
git clone <repository-url>
cd juris

# Start all infrastructure and services
npm run docker:up

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

This starts:
- PostgreSQL (port 5432)
- Apache Pulsar (ports 6650, 8080)
- Redis (port 6379)
- MinIO (ports 9000, 9001)
- All 7 microservices (ports 3001-3007)

## 🛠️ Manual Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd juris
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   # Copy root env
   cp .env.example .env
   
   # Copy service envs
   cp services/cias/.env.example services/cias/.env
   cp services/hub/.env.example services/hub/.env
   cp services/vault/.env.example services/vault/.env
   # ... repeat for other services
   ```

4. **Build shared packages**

   ```bash
   npm run build:packages
   ```

5. **Start services**

   ```bash
   npm run start:cias
   npm run start:hub
   npm run start:vault
   npm run start:comms
   npm run start:billing
   npm run start:siem
   npm run start:guard
   ```

## 📦 Shared Packages

### @juris/core
Common utilities, interfaces, DTOs, and constants shared across all services.

```typescript
import { PaginationDto, SERVICE_NAMES } from '@juris/core';
```

### @juris/database
Database configurations and base entities for TypeORM.

```typescript
import { BaseEntity, createDatabaseConfig } from '@juris/database';
```

### @juris/common
Common filters, interceptors, and utility functions.

```typescript
import { HttpExceptionFilter, ResponseInterceptor, winstonConfig } from '@juris/common';
```

### @juris/events
Event bus with Apache Pulsar for microservices communication.

```typescript
import { EventsModule, PulsarService, EVENT_TOPICS } from '@juris/events';

// In your module
@Module({
  imports: [EventsModule.forRoot()],
})
export class AppModule {}

// Publishing events
@Injectable()
export class UserService {
  constructor(private readonly pulsarService: PulsarService) {}

  async createUser(data: CreateUserDto) {
    const user = await this.userRepository.save(data);
    await this.pulsarService.publish(EVENT_TOPICS.USER_CREATED, user);
    return user;
  }
}
```

## 📦 NPM Scripts

```bash
# Build all workspaces
npm run build

# Build only shared packages
npm run build:packages

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Docker commands
npm run docker:up      # Start all services
npm run docker:down    # Stop all services
npm run docker:build   # Rebuild images
npm run docker:logs    # View logs

# Start individual services
npm run start:cias
npm run start:hub
npm run start:vault
npm run start:comms
npm run start:billing
npm run start:siem
npm run start:guard
```

## 🔄 Event Bus (Apache Pulsar)

The platform uses Apache Pulsar for event-driven communication between services.

### Event Topics

```typescript
EVENT_TOPICS = {
  // User events
  USER_CREATED: 'juris.user.created',
  USER_UPDATED: 'juris.user.updated',
  
  // Document events
  DOCUMENT_CREATED: 'juris.document.created',
  DOCUMENT_SHARED: 'juris.document.shared',
  
  // Billing events
  INVOICE_CREATED: 'juris.billing.invoice-created',
  PAYMENT_RECEIVED: 'juris.billing.payment-received',
  
  // And more...
}
```

### Publishing Events

```typescript
await this.pulsarService.publish(EVENT_TOPICS.USER_CREATED, {
  userId: user.id,
  email: user.email,
});
```

## 📦 TypeORM Migrations

```bash
# Navigate to service
cd services/cias

# Generate migration
npm run migration:generate -- src/migrations/Init

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

```typescript
@RequirePermissions({
  module: PermissionModule.USERS,
  permission: 'create'
})
```

### Two-Factor Authentication

- Email OTP-based 2FA support

## 📝 API Documentation

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "statusCode": 200
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## 🚀 Production Deployment

### Using Docker

```bash
# Build production images
npm run docker:build

# Start in production mode
docker-compose -f docker-compose.yml up -d
```

### Environment Variables

Ensure all production environment variables are configured:

- Database credentials
- JWT secrets
- Pulsar connection
- Redis connection
- AWS S3/MinIO credentials
- SMTP settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding! 🎉**

# Juris Legal Practice Management Platform

A comprehensive, production-ready NestJS monorepo for legal practice management, featuring microservices architecture with TypeORM, authentication, authorization, activity logging, file uploads, email services, and more.

## 🏗️ Monorepo Structure

```
juris/
├── packages/                   # Shared libraries
│   ├── shared-core/           # Core utilities, interfaces, DTOs
│   ├── shared-database/       # Database configurations, base entities
│   └── shared-common/         # Common filters, interceptors, utils
├── apps/                      # Frontend applications (future)
├── services/                  # Microservices
│   ├── cias/                  # Platform + Identity Service (Port 3001)
│   ├── hub/                   # Practice Domain Service (Port 3002)
│   ├── repo/                  # Documents Service (Port 3003)
│   ├── comms/                 # Communications Service (Port 3004)
│   ├── billing/               # Billing & AR Service (Port 3005)
│   ├── siem/                  # Search & Analytics Service (Port 3006)
│   └── guard/                 # Governance Service (Port 3007)
├── package.json               # Root package.json with workspaces
├── tsconfig.json              # Root TypeScript configuration
└── nest-cli.json              # NestJS CLI monorepo configuration
```

## 🚀 Microservices

| Service | Description | Port |
|---------|-------------|------|
| **cias** | Platform + Identity - Core platform functionality and user identity management | 3001 |
| **hub** | Practice Domain - Legal practice management features | 3002 |
| **repo** | Documents - Document management and storage | 3003 |
| **comms** | Communications - Messaging, notifications, and email | 3004 |
| **billing** | Billing & AR - Invoicing, payments, and accounts receivable | 3005 |
| **siem** | Search & Analytics - Search functionality and analytics | 3006 |
| **guard** | Governance - Compliance, policies, and governance | 3007 |

## 🚀 Features

### Core Features

- **NestJS Framework** - Modern Node.js framework for building scalable server-side applications
- **TypeORM Integration** - Powerful ORM with PostgreSQL support
- **JWT Authentication** - Secure authentication with access and refresh tokens
- **Role-Based Access Control (RBAC)** - Flexible permission system with roles and permissions
- **Two-Factor Authentication (2FA)** - Enhanced security with TOTP support
- **Forgot Password** - Secure password reset with email verification
- **Activity Logging** - Comprehensive user activity tracking and audit trails
- **File Upload Support** - AWS S3 integration for file storage
- **Email Service** - SMTP configuration for transactional emails
- **Global Exception Handling** - Centralized error handling and logging
- **Request/Response Interceptors** - Standardized API responses
- **Validation & Serialization** - Built-in data validation and transformation
- **Winston Logging** - Advanced logging with daily rotation and multiple transports

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- AWS S3 account (for file uploads)
- SMTP server (for email services)

## 🛠️ Installation

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

   Copy the `.env.example` file in each service and configure your environment variables:

   ```bash
   # For each service
   cp services/cias/.env.example services/cias/.env
   cp services/hub/.env.example services/hub/.env
   # ... repeat for other services
   ```

4. **Database Setup**

   Create your PostgreSQL databases for each service:
   - juris_cias_db
   - juris_hub_db
   - juris_repo_db
   - juris_comms_db
   - juris_billing_db
   - juris_siem_db
   - juris_guard_db

5. **Build shared packages**

   ```bash
   npm run build:packages
   ```

6. **Start services**

   ```bash
   # Start individual services
   npm run start:cias
   npm run start:hub
   npm run start:repo
   npm run start:comms
   npm run start:billing
   npm run start:siem
   npm run start:guard
   
   # Or start a specific service directly
   npm run start:dev --workspace=services/cias
   ```

## 📦 Shared Packages

### @juris/shared-core
Common utilities, interfaces, DTOs, and constants shared across all services.

```typescript
import { PaginationDto, SERVICE_NAMES } from '@juris/shared-core';
```

### @juris/shared-database
Database configurations and base entities for TypeORM.

```typescript
import { BaseEntity, createDatabaseConfig } from '@juris/shared-database';
```

### @juris/shared-common
Common filters, interceptors, and utility functions.

```typescript
import { HttpExceptionFilter, ResponseInterceptor, winstonConfig } from '@juris/shared-common';
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

# Run tests across all workspaces
npm run test

# Start individual services
npm run start:cias
npm run start:hub
npm run start:repo
npm run start:comms
npm run start:billing
npm run start:siem
npm run start:guard
```

## 📦 Manual TypeORM Migrations

This project uses manual migrations for database schema changes. Synchronize is disabled in the data source to prevent unintended schema updates.

### Configuration

- DataSource: Each service has its own `src/data-source.ts`
- Migrations directory: `services/<service>/src/migrations`

### Generate a migration

```bash
# Navigate to the service directory
cd services/cias

# Generate migration
npm run migration:generate -- src/migrations/Init
```

### Run migrations

```bash
cd services/cias
npm run migration:run
```

### Revert the last migration

```bash
cd services/cias
npm run migration:revert
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

```typescript
// Protect routes with permissions
@RequirePermissions({
  module: PermissionModule.USERS,
  permission: 'create'
})
```

### Two-Factor Authentication

- Email OTP-based 2FA (optional)

## 📊 Activity Logging

Automatic activity logging with the `@LogActivity` decorator:

```typescript
@LogActivity({
  action: ActivityAction.CREATE,
  description: 'User created successfully',
  resourceType: 'user',
  getResourceId: (result: User) => result.id
})
async createUser(@Body() createUserDto: CreateUserDto) {
  // Your logic here
}
```

## 🪣 S3 Utilities

AWS S3 integration for file storage is available through the shared-common package.

## 📧 Email Service

SMTP configuration for sending emails:

```typescript
// Send two-factor authentication code
await this.emailServiceUtils.sendTwoFactorCode({...});

// Send forgot password reset code
await this.emailServiceUtils.sendForgotPasswordResetCode({...});
```

## �� API Documentation

The template includes standardized API responses:

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
  "message": "Data retrieved successfully",
  "data": [...],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "statusCode": 200,
  "timestamp": "2025-11-03T15:43:11.561Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information",
  "statusCode": 400
}
```

## 🚀 Deployment

### Production Build

```bash
# Build all services
npm run build

# Or build specific service
npm run build --workspace=services/cias
```

### Environment Variables

Ensure all production environment variables are set for each service:

- Database credentials
- JWT secrets
- AWS S3 configuration
- SMTP settings

### Docker Support

The template is Docker-ready. Create a `Dockerfile` and `docker-compose.yml` for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the example implementations

---

**Happy coding! 🎉**

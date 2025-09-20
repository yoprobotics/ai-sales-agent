# API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://app.aisalesagent.com/api
```

## Authentication

The API uses JWT authentication with httpOnly cookies.

### Headers

No authorization headers needed - authentication is handled via cookies.

## Endpoints

### Authentication

#### POST /api/auth/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corp",
  "language": "en",
  "dataRegion": "US",
  "timezone": "America/New_York",
  "acceptTerms": true
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT",
    "plan": "STARTER"
  }
}
```

#### POST /api/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT",
    "plan": "STARTER",
    "isEmailVerified": false
  }
}
```

#### POST /api/auth/logout

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /api/auth/refresh

Refreshes the access token using the refresh token.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "role": "CLIENT",
    "plan": "STARTER"
  }
}
```

#### GET /api/auth/me

Get current authenticated user.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Acme Corp",
    "role": "CLIENT",
    "plan": "STARTER",
    "language": "en",
    "dataRegion": "US",
    "timezone": "America/New_York",
    "isEmailVerified": false,
    "lastLoginAt": "2024-12-20T10:00:00Z",
    "createdAt": "2024-12-01T10:00:00Z",
    "_count": {
      "icps": 2,
      "prospects": 150,
      "sequences": 3,
      "campaigns": 5
    }
  }
}
```

### Health Check

#### GET /api/health

Check API and database health.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-20T10:00:00Z",
  "services": {
    "database": "connected",
    "api": "operational"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": {} // Optional additional details
}
```

### Common Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily down

## Rate Limiting

- **Login attempts**: 5 per 15 minutes per email/IP
- **API requests**: 100 per 15 minutes per IP
- **Password reset**: 3 per hour per email

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703074800000
```

## Pagination

List endpoints support pagination:

```
GET /api/prospects?page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "data": [],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Webhooks

Coming soon:
- Prospect qualified
- Campaign completed
- Message replied
- Payment succeeded/failed
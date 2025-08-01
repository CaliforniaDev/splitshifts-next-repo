# Security Policy

## Overview

SplitShifts implements comprehensive security measures to protect user data and prevent common web application vulnerabilities. This document outlines our security practices and guidelines for developers working on the project.

## Authentication & Authorization

### Password Security
- **Hashing**: All passwords are hashed using bcrypt with appropriate salt rounds
- **Complexity Requirements**: Enforced password complexity with special characters and minimum length
- **Storage**: Passwords are never stored in plain text or reversibly encrypted

### Session Management
- **NextAuth.js**: Industry-standard session management with secure defaults
- **CSRF Protection**: Built-in Cross-Site Request Forgery protection
- **Secure Cookies**: HTTP-only and secure cookie flags in production
- **Session Expiration**: Automatic session timeout and cleanup

### Two-Factor Authentication (2FA)
- **TOTP Implementation**: Time-based One-Time Password using industry-standard algorithms
- **QR Code Security**: Secure QR code generation for authenticator app setup
- **Backup Codes**: Planned implementation for account recovery options

## Token Security

### Centralized Token Management
All authentication tokens use a standardized secure format with centralized management:

```typescript
// Secure token generation (64-character hex)
const token = generateSecureToken(); // Uses randomBytes(32).toString('hex')

// Format validation with type safety
if (isValidTokenFormat(token)) {
  // Process valid token
}
```

### Token Configuration
- **Byte Length**: 32 bytes (256-bit entropy)
- **Encoding**: Hexadecimal (64 characters)
- **Validation**: Strict format validation using regex patterns
- **Expiration**: Time-limited tokens with automatic cleanup

### Token Format Decision: Hex vs JWT

**Why we chose hex tokens over JWT:**

```typescript
// Our approach: Simple hex tokens with database-managed expiration
const token = generateSecureToken(); // 64-char hex, 256-bit entropy
```

**Hex Token Advantages:**
- **Revocable**: Can be immediately invalidated in database
- **Simple**: Minimal implementation complexity reduces attack surface  
- **Stateful**: Database-controlled expiration and validation
- **Lightweight**: Smaller size than JWT tokens
- **Secure**: 256-bit entropy exceeds cryptographic requirements

**JWT Considerations:**
- **Self-contained**: No database lookup needed for basic validation
- **Standardized**: Industry-standard format
- **Embedded claims**: Can include user ID, expiration, etc.
- **Stateless**: Cannot be revoked without additional infrastructure
- **Complex**: More implementation complexity and potential vulnerabilities

**Decision Rationale:**
For email verification and password reset, we require database interaction anyway to update user state, making the stateful nature of hex tokens an advantage rather than a limitation.

### Token Types
1. **Email Verification Tokens**: 24-hour expiration, single-use
2. **Password Reset Tokens**: 1-hour expiration, single-use
3. **Session Tokens**: Managed by NextAuth.js with configurable expiration

## Email Security

### Verification System
- **Mandatory Verification**: Email verification required for account activation
- **Token-Based**: Secure token delivery via email
- **Rate Limiting**: Protection against verification email spam
- **Secure Links**: URL validation and proper encoding

### URL Generation
```typescript
// Automatically validates SITE_BASE_URL environment variable
// Development: allows HTTP/HTTPS
// Production: enforces HTTPS for security
const verificationLink = buildVerificationLink(token);
const resetLink = buildPasswordResetLink(token);
```

### Environment Validation
- **URL Format Validation**: Environment-specific validation for maximum security
  - **Development**: Accepts HTTP and HTTPS URLs for local development
  - **Production**: Enforces HTTPS-only to prevent man-in-the-middle attacks
- **Normalization**: Automatic trailing slash removal for consistency
- **Error Handling**: Clear error messages for misconfigured environments

## Data Protection

### Input Validation
- **Zod Schemas**: Type-safe validation for all forms and API endpoints
- **Client & Server**: Validation on both client and server sides
- **Sanitization**: Proper input sanitization to prevent injection attacks

### Error Handling
- **Production Safety**: Generic error messages in production
- **Development Detail**: Detailed error logging in development only
- **Information Disclosure**: Prevents sensitive information leakage

```typescript
// Environment-specific logging
logError('Authentication failed', error);
// Development: Full error details
// Production: Generic message only
```

### Database Security
- **ORM Protection**: Drizzle ORM prevents SQL injection
- **Connection Security**: Secure database connections via Neon
- **Schema Validation**: Type-safe database operations

## Environment Security

### Required Environment Variables
```env
# Critical for email link security
# Development
SITE_BASE_URL="http://localhost:3000"   # HTTP allowed in development
# Production  
SITE_BASE_URL="https://yourdomain.com" # HTTPS required in production

# Authentication secrets
NEXTAUTH_SECRET="cryptographically-secure-secret"
NEXTAUTH_URL="https://yourdomain.com"

# Email configuration
RESEND_API_KEY="your-secure-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# Database
DATABASE_URL="postgresql://secure-connection-string"
```

### Configuration Validation
- **Environment-Specific Validation**: Development vs production URL requirements
  - **Development**: HTTP and HTTPS URLs accepted for local development
  - **Production**: HTTPS-only enforcement for security compliance
- **Startup Validation**: Critical environment variables validated at startup
- **Runtime Checks**: Additional validation during operation
- **Fail-Safe**: Application fails gracefully with clear error messages

## Development Security Practices

### Code Quality
- **TypeScript**: Full type safety across the application
- **ESLint**: Security-focused linting rules
- **Dependency Management**: Regular dependency updates and security audits

### Error Logging
```typescript
// Centralized error logging utility
import { logError } from '@/app/lib/utils';

try {
  // Operation that might fail
} catch (error) {
  // Logs detailed errors in development, generic in production
  logError('Operation context', error);
}
```

### Route Protection
- **Middleware**: Authentication middleware for protected routes
- **Email Verification**: Required verification for account access
- **Authorization**: Role-based access control (planned)

## Security Headers

### HTTP Security Headers
- **Strict-Transport-Security**: HTTPS enforcement
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing prevention
- **Referrer-Policy**: Referrer information control

### Content Security Policy
Implemented via Next.js security headers for:
- Script source restrictions
- Style source limitations
- Image source controls
- Frame ancestor restrictions

## Incident Response

### Security Issues
If you discover a security vulnerability, please:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to: [leodaniels@californiadev.com](mailto:leodaniels@californiadev.com)
3. Include detailed information about the vulnerability
4. Allow reasonable time for response and fix implementation

### Response Process
1. **Acknowledgment**: Within 24 hours
2. **Assessment**: Security team evaluation
3. **Fix Development**: Priority patching
4. **Disclosure**: Coordinated disclosure after fix deployment

## Compliance & Standards

### Security Standards
- **OWASP**: Following OWASP security guidelines
- **NIST**: Aligned with NIST cybersecurity framework
- **Industry Best Practices**: Modern web application security standards

### Regular Security Reviews
- **Code Reviews**: Security-focused code review process
- **Dependency Audits**: Regular third-party dependency security checks
- **Penetration Testing**: Planned security testing cycles

## Security Roadmap

### Planned Enhancements
- **Rate Limiting**: Enhanced rate limiting for API endpoints
- **Audit Logging**: Comprehensive security event logging
- **Backup Codes**: 2FA backup codes for account recovery
- **Account Lockout**: Brute force protection
- **Security Headers**: Enhanced CSP and security header implementation

---

*Last Updated: August 2025*
*Security Policy Version: 1.0*

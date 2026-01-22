# Documentation Index

Welcome to the SplitShifts documentation! This directory contains comprehensive guides for understanding, developing, and maintaining the SplitShifts application.

## 📚 Available Documentation

### Core Documentation
- **[Project Overview](./PROJECT_OVERVIEW.md)** - Complete tech stack, dependencies, and project structure
- **[Architecture Guide](./ARCHITECTURE.md)** - System design patterns, data flow, and architectural decisions
- **[Implementation Plan](./IMPLEMENTATION_PLAN.md)** - 5-phase MVP roadmap with timelines, acceptance criteria, and current progress (Week 1-2: Phase 1 in progress)
- **[Organization Management Complete](./ORGANIZATION_MANAGEMENT_COMPLETE.md)** - Comprehensive guide to organization CRUD operations, cascade deletes, and modal system

### Database & Backend
- **[Complete ERD](./database/complete-erd.md)** - Entity relationship diagram for all database tables
- **[Schema Design](./database/entities-and-design.md)** - Table schemas, relationships, and design decisions
- **[Migration Plan](./database/migration-plan.md)** - Database migration strategy and guidelines
- **[Cleanup Strategy](./database/CLEANUP_STRATEGY.md)** - Soft delete patterns and data retention policies

### Security & Auth
- **[Security Policy](./security/SECURITY.md)** - Password, token, and environment hardening guidelines
- **[Navigation Performance Fix](./security/NAVIGATION_PERFORMANCE_FIX.md)** - Session-layer refactor that eliminated navigation lag
- **[Email Verification Improvements](./auth/EMAIL_VERIFICATION_IMPROVEMENT.md)** - Structured error handling and UX upgrades for login

### UI Reference
- **[UI Components](./ui/UI_COMPONENTS.md)** - Button, Input (including icon slots), Form components with React Hook Form + Radix Dialog integration patterns
- **[Dashboard Icons Guide](./ui/DASHBOARD_ICONS_GUIDE.md)** - Icon exports, variants, and navigation integration examples

### Development Guides *(Coming Soon)*
- **[API Documentation](./API.md)** - API endpoints, authentication, and usage examples
- **[Contributing Guide](./CONTRIBUTING.md)** - Development workflow, coding standards, and PR guidelines
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment, environment setup, and CI/CD

### Reference Materials *(Coming Soon)*
- **[Component Library](./COMPONENTS.md)** - UI component documentation and usage
- **[Changelog](./CHANGELOG.md)** - Version history and release notes

## 🚀 Quick Navigation

### For New Developers
1. Start with [Project Overview](./PROJECT_OVERVIEW.md) to understand the tech stack
2. Review [Architecture Guide](./ARCHITECTURE.md) for system design
3. Follow setup instructions in the [main README](../README.md)

### For Contributors
1. Read the [Contributing Guide](./CONTRIBUTING.md) *(coming soon)*
2. Check the [Architecture Guide](./ARCHITECTURE.md) for patterns
3. Reference [Component Library](./COMPONENTS.md) for UI guidelines *(coming soon)*

### For DevOps/Deployment
1. Follow the [Deployment Guide](./DEPLOYMENT.md) *(coming soon)*
2. Check [Project Overview](./PROJECT_OVERVIEW.md) for environment requirements

## 📝 Documentation Standards

### Markdown Guidelines
- Use standard Markdown syntax for maximum compatibility
- Include code examples where relevant  
- Add table of contents for longer documents
- Use descriptive headings and clear structure

### Code Examples
- Provide TypeScript examples with proper typing
- Include both component usage and implementation
- Show real-world scenarios when possible
- Keep examples up-to-date with current codebase

### Maintenance
- Update documentation with code changes
- Include version information and last updated dates
- Review documentation during PR reviews
- Archive outdated information appropriately

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material Design 3](https://m3.material.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)

---

**Documentation Status**: In Progress  
**Last Updated**: November 2025

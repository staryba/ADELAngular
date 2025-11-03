# ADEL Angular Frontend

Angular frontend application for the ADEL (Adaptive Dynamic Entity Layer) WebApi system - a dynamic entity management platform with profile-based schema definitions and revision tracking.

## Overview

This Angular application provides a modern, responsive user interface for managing:
- **Profiles**: Schema definitions that act as templates for entities
- **Entities**: Data instances created from profiles with full revision history
- **Nested Structures**: Hierarchical parent-child relationships
- **Soft Delete/Restore**: Logical deletion with complete audit trails

## Features

- Profile management (create, update, view)
- Entity CRUD operations with smart revision tracking
- Table views for entity data visualization
- Soft delete and restore functionality
- Nested entity/profile hierarchies
- Real-time data synchronization with backend API

## Technology Stack

- **Angular**: v17.2.0 (latest stable LTS)
- **TypeScript**: v5.3.2
- **RxJS**: v7.8.0
- **SCSS**: For styling
- **Angular Router**: For navigation

## Prerequisites

- Node.js v20.11.1 or higher
- npm v10.2.4 or higher
- Angular CLI v17.2.1

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/staryba/ADELAngular.git
cd ADELAngular

# Install dependencies
npm install
```

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

```bash
npm start
# or
ng serve
```

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
npm run build
# or
ng build --configuration production
```

## Project Structure

```
src/
├── app/
│   ├── components/      # Reusable UI components
│   ├── services/        # API services and state management
│   ├── models/          # TypeScript interfaces and types
│   ├── guards/          # Route guards
│   └── app.routes.ts    # Application routes
├── assets/              # Static assets (images, icons, etc.)
└── styles.scss          # Global styles
```

## Backend API

This frontend connects to the ADEL WebApi backend:
- Repository: [ADELWebApi](https://github.com/staryba/ADELWebApi)
- API Base URL: `http://localhost:5000/api/v1` (configurable)

### API Endpoints Used

- `GET/POST /profiles` - Profile management
- `GET/POST /entities` - Entity operations
- `DELETE /profiles/{id}/soft` - Soft delete profiles
- `PUT /profiles/{id}/restore` - Restore profiles
- `DELETE /entities/{id}/soft` - Soft delete entities
- `PUT /entities/{id}/restore` - Restore entities
- `GET /profiles/{id}/table` - Table view of entities

## Development

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use:

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

### Running Tests

```bash
# Unit tests
npm test
# or
ng test

# Code coverage
ng test --code-coverage
```

### Linting

```bash
ng lint
```

## Configuration

Update the API base URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1'
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the ADEL system.

## Related Projects

- [ADEL WebApi](https://github.com/staryba/ADELWebApi) - Backend API

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

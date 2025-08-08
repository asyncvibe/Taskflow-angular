# Angular Interview Project - Amisha Joshi

## 🎯 Project Overview

This is a comprehensive Angular 19 project designed as a refresher for Angular interviews. It demonstrates modern Angular concepts, best practices, and real-world patterns that are commonly asked about in interviews.

## 🏗️ Architecture & Structure

### Project Structure

```
src/app/
├── animations/          # Custom Angular animations
├── features/           # Feature modules (lazy-loaded)
│   ├── auth/          # Authentication module
│   └── dashboard/     # Dashboard with layout
├── guards/            # Route guards (auth, admin, etc.)
├── interceptors/      # HTTP interceptors
├── models/            # TypeScript interfaces and types
├── pages/             # Static pages (404, 401)
├── services/          # Injectable services
└── shared/            # Reusable components, pipes, directives
```

## 🔥 Key Angular Concepts Demonstrated

### 1. **Modern Angular Architecture (v19)**

- **Standalone Components**: All components use the new standalone API
- **Application Configuration**: Using `ApplicationConfig` and providers
- **Functional Guards**: Modern guard implementation using functions
- **Injectable Services**: Dependency injection patterns

### 2. **TypeScript & Models**

- **Interfaces & Enums**: Comprehensive type definitions
- **Generic Types**: Reusable API response types
- **Type Guards**: Runtime type checking functions
- **Union Types**: Complex type combinations

### 3. **State Management & Services**

- **BehaviorSubject**: Real-time state management
- **Observable Patterns**: RxJS operators and streams
- **Service Communication**: Cross-component data sharing
- **HTTP Client**: API communication with error handling

### 4. **Reactive Forms**

- **FormBuilder**: Complex form creation
- **Validators**: Built-in and custom validation
- **Dynamic Forms**: Form state management
- **Async Validators**: Server-side validation

### 5. **Routing & Navigation**

- **Lazy Loading**: Performance optimization
- **Route Guards**: Authentication and authorization
- **Nested Routes**: Complex routing structures
- **Route Parameters**: Dynamic routing

### 6. **Component Communication**

- **@Input/@Output**: Parent-child communication
- **EventEmitter**: Custom event handling
- **Services**: Cross-component communication
- **ViewChild/ViewChildren**: DOM access

### 7. **Custom Pipes & Directives**

- **Pure Pipes**: Data transformation
- **Custom Directives**: DOM manipulation
- **Attribute Directives**: Element behavior modification
- **Structural Directives**: Template structure changes

### 8. **HTTP & Interceptors**

- **HTTP Client**: RESTful API communication
- **Interceptors**: Request/response modification
- **Error Handling**: Global error management
- **Loading States**: UI feedback during requests

### 9. **Animations**

- **Angular Animations**: Smooth UI transitions
- **Custom Triggers**: Complex animation sequences
- **State Transitions**: Component state animations
- **Keyframes**: Detailed animation control

## 📁 Key Files & Their Purpose

### Core Configuration

- `app.config.ts` - Application configuration and providers
- `app.routes.ts` - Main routing configuration
- `app.component.ts` - Root application component

### Models & Types

- `user.model.ts` - User interface with enums and type guards
- `task.model.ts` - Task management types and interfaces
- `product.model.ts` - E-commerce related types
- `api-response.model.ts` - Generic API response types

### Services

- `user.service.ts` - Authentication and user management
- `task.service.ts` - Advanced RxJS patterns and filtering
- `api.service.ts` - Generic HTTP service with error handling
- `notification.service.ts` - Cross-component notifications

### Guards

- `auth.guard.ts` - Authentication protection (functional guards)
- `unsaved-changes.guard.ts` - Form protection guard

### Shared Components

- `loading-spinner.component.ts` - Reusable loading indicator
- `confirmation-dialog.component.ts` - Modal dialog component

### Pipes & Directives

- `filter.pipe.ts` - Generic array filtering
- `date-format.pipe.ts` - Custom date formatting
- `highlight.directive.ts` - DOM manipulation directives

### Interceptors

- `auth.interceptor.ts` - Authentication header injection
- Error and loading interceptors for global handling

## 🎨 Features Implemented

### Authentication Module

- **Login Form**: Reactive forms with validation
- **Registration**: Complex form with async validation
- **Password Reset**: Multi-step form process
- **Role-based Access**: Admin/user role differentiation

### Dashboard

- **Layout Component**: Responsive navigation and sidebar
- **User Menu**: Dropdown with user actions
- **Route Navigation**: Dynamic menu based on user role

### Task Management

- **CRUD Operations**: Create, read, update, delete tasks
- **Advanced Filtering**: Search, status, priority filters
- **Real-time Updates**: Observable-based state management
- **Bulk Operations**: Multiple item actions

### Shared Utilities

- **Loading States**: Global loading management
- **Notifications**: Toast-style notifications
- **Confirmation Dialogs**: User action confirmations
- **Custom Animations**: Smooth UI transitions

## 🧪 Testing Strategy

### Testing Setup

- **Karma + Jasmine**: Angular's default testing framework
- **Test Configuration**: Proper TypeScript and Angular setup
- **Testing Utilities**: Helper functions and mocks
- **Coverage Reports**: Code coverage tracking

### Testing Concepts Covered

- **Unit Tests**: Individual component/service testing
- **Integration Tests**: Component-service interaction
- **Mock Services**: Dependency isolation
- **Observable Testing**: Async operation testing
- **Form Testing**: Reactive form validation testing
- **Router Testing**: Navigation and guard testing

### Test Files Structure

```
src/app/
├── **/*.spec.ts          # Unit tests for each component/service
├── test-setup.ts         # Global test configuration
├── karma.conf.js         # Karma configuration
└── TESTING.md           # Comprehensive testing guide
```

## 🚀 Interview Preparation Value

### Technical Concepts You Can Discuss

1. **Angular Architecture**: Component lifecycle, dependency injection
2. **RxJS Patterns**: Observables, operators, state management
3. **TypeScript Features**: Interfaces, generics, type guards
4. **Form Handling**: Reactive vs template-driven forms
5. **HTTP Communication**: Interceptors, error handling
6. **Performance**: Lazy loading, OnPush strategy, pipe optimization
7. **Testing**: Unit testing, mocking, async testing
8. **Security**: Authentication, authorization, XSS prevention

### Real-world Patterns Demonstrated

- **Service Layer Architecture**: Separation of concerns
- **Error Handling**: Graceful error management
- **User Experience**: Loading states, notifications
- **Code Organization**: Feature modules, shared utilities
- **Type Safety**: Comprehensive TypeScript usage
- **Performance Optimization**: Lazy loading, pure pipes

## 📝 Interview Questions This Project Helps Answer

### Angular Core

- "Explain the component lifecycle hooks"
- "What's the difference between @Input and @Output?"
- "How do you implement inter-component communication?"
- "Explain dependency injection in Angular"

### RxJS & Observables

- "What's the difference between Observable and Promise?"
- "Explain operators like map, filter, switchMap"
- "How do you handle error in Observable streams?"
- "What is a BehaviorSubject and when to use it?"

### Forms & Validation

- "Reactive forms vs template-driven forms?"
- "How do you implement custom validators?"
- "Explain form state management"
- "How do you handle async validation?"

### Routing & Guards

- "How do you implement route guards?"
- "Explain lazy loading and its benefits"
- "How do you pass data between routes?"
- "What are route resolvers?"

### HTTP & Services

- "How do you implement HTTP interceptors?"
- "Explain error handling in HTTP calls"
- "What are the benefits of using services?"
- "How do you handle authentication tokens?"

### Performance & Best Practices

- "How do you optimize Angular applications?"
- "Explain OnPush change detection strategy"
- "What are pure pipes and their benefits?"
- "How do you implement lazy loading?"

## 🔧 Running the Project

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Run tests
ng test

# Build for production
ng build --production
```

### Available Scripts

- `ng serve` - Development server (http://localhost:4200)
- `ng test` - Run unit tests
- `ng build` - Build the project
- `ng lint` - Run linting

## 📚 Learning Resources

### Key Files to Study

1. `src/app/services/task.service.ts` - Advanced RxJS patterns
2. `src/app/guards/auth.guard.ts` - Functional guards implementation
3. `src/app/features/auth/components/login/login.component.ts` - Reactive forms
4. `src/app/interceptors/auth.interceptor.ts` - HTTP interceptors
5. `src/app/animations/app.animations.ts` - Angular animations

### Concepts to Practice

- Component communication patterns
- Observable composition with RxJS
- Form validation strategies
- HTTP error handling
- Route protection mechanisms
- State management patterns

## 🎯 Next Steps for Further Learning

1. **Add E2E Tests**: Implement Cypress or Protractor tests
2. **State Management**: Integrate NgRx for complex state
3. **PWA Features**: Add service workers and offline capability
4. **Internationalization**: Implement i18n for multiple languages
5. **Performance Monitoring**: Add Angular DevTools integration
6. **CI/CD Pipeline**: Set up automated testing and deployment

This project serves as a comprehensive reference for Angular interviews and demonstrates real-world development patterns that are essential for modern Angular development.

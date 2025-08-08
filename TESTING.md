# Testing Guide - Amisha Joshi Angular Project

This document provides comprehensive information about the testing strategy, setup, and best practices implemented in this Angular project.

## 🧪 Testing Strategy

### Testing Pyramid

Our testing approach follows the testing pyramid with emphasis on:

1. **Unit Tests (70%)** - Fast, isolated tests for individual components, services, pipes, and directives
2. **Integration Tests (20%)** - Tests that verify component-service interactions
3. **End-to-End Tests (10%)** - Full application flow testing (not implemented in this phase)

### Testing Frameworks & Tools

- **Jasmine** - Testing framework providing describe/it syntax and matchers
- **Karma** - Test runner for executing tests in browsers
- **Angular Testing Utilities** - TestBed, ComponentFixture, etc.
- **HttpClientTestingModule** - For testing HTTP interactions
- **SpyOn and Mocks** - For isolating dependencies

## 🏗️ Test Setup

### Configuration Files

- `karma.conf.js` - Karma configuration for test runner
- `tsconfig.spec.json` - TypeScript configuration for tests
- `src/test-setup.ts` - Global test setup and utilities
- `angular.json` - Angular CLI test configuration

### Test Setup Features

```typescript
// src/test-setup.ts includes:
- localStorage/sessionStorage mocks
- Custom Jasmine matchers
- IntersectionObserver/ResizeObserver mocks
- matchMedia mock for responsive testing
- Global test utilities (TestUtils class)
```

## 📁 Test File Structure

```
src/
├── app/
│   ├── app.component.spec.ts
│   ├── services/
│   │   ├── user.service.spec.ts
│   │   ├── task.service.spec.ts
│   │   ├── api.service.spec.ts
│   │   └── notification.service.spec.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── loading-spinner/loading-spinner.component.spec.ts
│   │   │   └── confirmation-dialog/confirmation-dialog.component.spec.ts
│   │   └── pipes/
│   │       ├── filter.pipe.spec.ts
│   │       └── date-format.pipe.spec.ts
│   ├── guards/
│   │   └── auth.guard.spec.ts
│   └── features/
│       └── auth/components/login/login.component.spec.ts
└── test-setup.ts
```

## 🎯 Testing Concepts Covered

### 1. Component Testing

#### Standalone Components

```typescript
// Testing standalone components
await TestBed.configureTestingModule({
  imports: [ComponentName], // Import instead of declare
  providers: [
    /* mock services */
  ],
}).compileComponents();
```

#### Input/Output Testing

```typescript
// Testing @Input properties
component.inputProperty = "test value";
expect(component.inputProperty).toBe("test value");

// Testing @Output events
spyOn(component.outputEvent, "emit");
component.triggerEvent();
expect(component.outputEvent.emit).toHaveBeenCalled();
```

#### Template Testing

```typescript
// DOM interaction testing
const button = fixture.nativeElement.querySelector("button");
button.click();
fixture.detectChanges();
```

### 2. Service Testing

#### HTTP Service Testing

```typescript
// Using HttpClientTestingModule
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ServiceName],
  });
  httpMock = TestBed.inject(HttpTestingController);
});

// Testing HTTP requests
service.getData().subscribe();
const req = httpMock.expectOne("/api/data");
req.flush(mockData);
```

#### Observable Testing

```typescript
// Testing BehaviorSubject and Observable streams
service.data$.subscribe((data) => {
  expect(data).toEqual(expectedData);
});
service.updateData(newData);
```

### 3. Pipe Testing

#### Pure Pipe Testing

```typescript
// Testing transformation logic
const pipe = new PipeName();
const result = pipe.transform(input, ...args);
expect(result).toBe(expectedOutput);
```

### 4. Guard Testing

#### Functional Guards (Angular 15+)

```typescript
// Testing CanActivate guards
const result = TestBed.runInInjectionContext(() => guardFunction(mockRoute, mockState));
expect(result).toBe(true);
```

### 5. Reactive Forms Testing

#### Form Validation

```typescript
// Testing form validators
const control = component.form.get("fieldName");
control?.setValue("invalid");
expect(control?.hasError("required")).toBe(true);
```

#### User Interactions

```typescript
// Simulating user input
const input = fixture.nativeElement.querySelector("input");
input.value = "test value";
input.dispatchEvent(new Event("input"));
expect(component.form.get("field")?.value).toBe("test value");
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
ng test

# Run tests in headless mode (CI)
ng test --browsers=ChromeHeadless --watch=false

# Run tests with coverage
ng test --code-coverage

# Run specific test file
ng test --include="**/*component-name*.spec.ts"
```

### Test Configuration Options

```bash
# Single run (no watch mode)
ng test --watch=false

# Custom browsers
ng test --browsers=Chrome,Firefox

# Parallel execution
ng test --max-workers=4
```

## 📊 Code Coverage

### Coverage Reports

Coverage reports are generated in `coverage/amisha_joshi/` and include:

- HTML report (`index.html`)
- LCOV format for CI integration
- Text summary in console

### Coverage Thresholds

Configured in `karma.conf.js`:

```javascript
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

## 🛠️ Testing Utilities

### Custom Test Utilities

```typescript
// Available in TestUtils class
TestUtils.createMockUser(overrides);
TestUtils.createMockHttpResponse(data, status);
TestUtils.delay(ms);
TestUtils.detectChangesAsync(fixture);
```

### Custom Matchers

```typescript
// Custom Jasmine matcher
expect(value).toBeWithinRange(min, max);
```

### Mock Objects

```typescript
// Pre-configured mocks available
- localStorageMock
- sessionStorageMock
- IntersectionObserver mock
- ResizeObserver mock
- matchMedia mock
```

## 🎯 Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
it("should do something", () => {
  // Arrange - Set up test data and conditions
  const input = "test data";

  // Act - Execute the code under test
  const result = component.method(input);

  // Assert - Verify the results
  expect(result).toBe(expectedOutput);
});
```

### 2. Descriptive Test Names

```typescript
// Good: Specific and descriptive
it("should return error message when email is invalid format");

// Bad: Vague and unclear
it("should validate email");
```

### 3. Mock Dependencies

```typescript
// Always mock external dependencies
const mockService = jasmine.createSpyObj("ServiceName", ["method1", "method2"]);
```

### 4. Test Edge Cases

```typescript
// Test null/undefined inputs
// Test empty arrays/strings
// Test boundary conditions
// Test error scenarios
```

### 5. Keep Tests Independent

```typescript
beforeEach(() => {
  // Reset state before each test
  component.resetData();
  localStorage.clear();
});
```

## 🔍 Debugging Tests

### Debug in Browser

```bash
# Open browser debug interface
ng test --browsers=Chrome
# Click "Debug" in Karma interface
```

### Console Debugging

```typescript
// Add debugging statements in tests
console.log("Current state:", component.state);
console.log("Form values:", component.form.value);
```

### Isolate Failing Tests

```typescript
// Focus on specific test
fit("should test only this", () => {
  // test implementation
});

// Skip specific test
xit("should skip this test", () => {
  // test implementation
});
```

## 📈 Performance Considerations

### Optimize Test Performance

- Use `TestBed.configureTestingModule` only when needed
- Reuse test setup when possible
- Mock heavy dependencies
- Use shallow rendering for component tests

### Parallel Execution

```bash
ng test --max-workers=4
```

## 🔄 Continuous Integration

### CI Configuration Example

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    npm ci
    ng test --browsers=ChromeHeadless --watch=false --code-coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 📚 Learning Resources

### Key Testing Topics Demonstrated

1. **Dependency Injection Testing** - Mock services and providers
2. **Async Testing** - Handle Observables and Promises
3. **DOM Testing** - Interact with rendered templates
4. **Form Testing** - Validate reactive forms
5. **Guard Testing** - Test route protection
6. **HTTP Testing** - Mock API calls
7. **State Management Testing** - BehaviorSubject patterns
8. **Error Handling Testing** - Exception scenarios

### Angular Testing Documentation

- [Angular Testing Guide](https://angular.io/guide/testing)
- [TestBed Documentation](https://angular.io/api/core/testing/TestBed)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)

## 🎯 Interview Preparation Notes

This testing setup demonstrates understanding of:

- **Unit vs Integration Testing**
- **Mocking and Spying**
- **Async Testing Patterns**
- **Component Lifecycle Testing**
- **Service Layer Testing**
- **Form Validation Testing**
- **Route Guard Testing**
- **HTTP Client Testing**
- **Observable Stream Testing**
- **Error Handling Testing**

Each test file includes comprehensive comments explaining the testing concepts being demonstrated, making it an excellent reference for Angular testing interviews.

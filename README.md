# Mobile Automation Framework

A comprehensive, enterprise-grade mobile automation framework built with WebDriverIO, designed for scalability, maintainability, and industry best practices.

## Features

### Core Features

- **Page Object Model (POM)** with inheritance-based architecture
- **Environment-specific configurations** (Local, Stage, Production)
- **Advanced custom commands** for enhanced functionality
- **Comprehensive test data management** system
- **CI/CD integration** with GitHub Actions
- **Multiple reporting formats** (Allure, JUnit, Spec)
- **Screenshot and video capture** on failures
- **Retry mechanisms** with exponential backoff
- **Parallel test execution** support
- **Docker support** for containerized testing
- **TypeScript support** for better type safety
- **ESLint & Prettier** for code quality and formatting
- **Husky pre-commit hooks** for code quality enforcement
- **Comprehensive logging and error handling**

### Architecture Highlights

- **BasePage**: Common functionality for all page objects
- **BaseTest**: Shared test utilities and setup
- **EnvironmentConfig**: Dynamic configuration management
- **TestDataManager**: Centralized test data handling
- **Enhanced Commands**: Industry-standard custom commands

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Test Execution](#test-execution)
- [CI/CD Setup](#cicd-setup)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## Quick Start

### Prerequisites

- Node.js 18+
- Appium 2.2.2+
- Android SDK (for Android testing)
- Xcode (for iOS testing, macOS only)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mobile-automation-framework
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Appium**

   ```bash
   npm run setup:appium
   ```

4. **Run tests**

   ```bash
   # Local environment
   npm test

   # Specific environment
   npm run test:stage
   npm run test:prod
   ```

## Project Structure

├── .github/workflows/          # CI/CD workflows
│   └── ci.yml                  # GitHub Actions CI/CD pipeline
├── .husky/                     # Git hooks
│   └── pre-commit              # Pre-commit linting hook
├── app/                        # Mobile app files
│   ├── android/                # Android APK files
│   └── iOS/                    # iOS app files
├── test/
│   ├── commands/               # Custom WebDriverIO commands
│   │   └── enhanced-commands.js # Enhanced custom commands
│   ├── config/                 # Configuration files
│   │   ├── base.config.js      # Base configuration class
│   │   ├── devices.js          # Device configurations
│   │   ├── environment.android.js # Android environment config
│   │   ├── environment.ios.js  # iOS environment config
│   │   └── environment.browser.js # Browser environment config
│   ├── data/                   # Test data management
│   │   ├── base-test-data.json # Base test data
│   │   ├── local-test-data.json # Local environment data
│   │   └── TestDataManager.js  # Test data manager
│   ├── screenObjects/          # Page Object Model
│   │   ├── base/               # Base page classes
│   │   │   └── BasePage.js     # Base page functionality
│   │   ├── android/            # Android-specific pages
│   │   │   ├── LoginScreen.js  # Login screen page object
│   │   │   └── HomeScreen.js   # Home screen page object
│   │   └── iOS/                # iOS-specific pages
│   ├── specs/                  # Test specifications
│   │   ├── android/            # Android test suites
│   │   │   └── user-requirements-test.spec.js
│   │   ├── iOS/                # iOS test suites
│   │   │   └── user-requirements-test.spec.js
│   │   ├── android-mobile-web/ # Android mobile web tests
│   │   ├── ios-mobile-web/     # iOS mobile web tests
│   │   └── browser/            # Browser tests
│   ├── testObjects/            # Test base classes
│   │   └── BaseTest.js         # Base test functionality
│   └── utils/                  # Utility functions
│       ├── MobileCommandUtil.js
│       └── mobileGestures.js
├── test-results/               # Test execution results
├── logs/                       # Application logs
├── screenshots/                # Screenshots
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
├── wdio.conf.js                # WebDriverIO configuration
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.cjs               # ESLint configuration
├── .prettierrc.cjs             # Prettier configuration
├── .prettierignore             # Prettier ignore patterns
├── .gitignore                  # Git ignore patterns
├── package.json                # Project dependencies and scripts
└── README.md                   # This documentation

## Configuration

### Environment Configuration

The framework supports three environments with different configurations:

#### Local Environment

- **Purpose**: Development and debugging
- **Features**: Screenshots enabled, detailed logging
- **Usage**: `ENVIRONMENT=local npm test`

#### Stage Environment

- **Purpose**: Pre-production testing
- **Features**: Screenshots and videos enabled, moderate timeouts
- **Usage**: `ENVIRONMENT=stage npm test`

#### Production Environment

- **Purpose**: Final validation
- **Features**: Screenshots disabled, extended timeouts, maximum retries
- **Usage**: `ENVIRONMENT=prod npm test`

### Environment Variables

| Variable        | Description                  | Default              | Required |
| --------------- | ---------------------------- | -------------------- | -------- |
| `ENVIRONMENT`   | Test environment             | `local`              | No       |
| `APPIUM_HOST`   | Appium server host           | `localhost`          | No       |
| `APPIUM_PORT`   | Appium server port           | `4723`               | No       |
| `DEVICE_NAME`   | Device/emulator name         | Environment-specific | No       |
| `LOG_LEVEL`     | Logging level                | `info`               | No       |
| `MAX_INSTANCES` | Parallel execution instances | `5`                  | No       |

## Test Execution

### Basic Commands

```bash
# Run all tests in local environment
npm test

# Run tests in specific environment
npm run test:local
npm run test:stage
npm run test:prod

# Run specific test suites
npm run test:smoke      # Smoke tests only
npm run test:regression # Regression tests only
npm run test:android    # Android tests only
npm run test:ios        # iOS tests only

# Debug mode
npm run test:debug      # Detailed logging
npm run test:headed     # Headed mode (if supported)
```

### Advanced Execution

```bash
# Parallel execution
npm run test:parallel

# Specific test by grep pattern
GREP="login" npm test

# Custom configuration
ENVIRONMENT=stage MAX_INSTANCES=3 npm run test:ci
```

### CI/CD Execution

```bash
# CI mode (used by GitHub Actions)
npm run test:ci

# Docker execution
npm run docker:test
```

### Docker Usage

```bash
# Build Docker image
npm run docker:build

# Run tests in Docker container
npm run docker:test

# Docker Compose (full environment)
npm run docker:compose:up    # Start all services
npm run docker:compose:test  # Run tests
npm run docker:compose:down  # Stop all services
```

### Development Tools

```bash
# Code quality and formatting
npm run lint              # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
npm run validate          # Run linting and formatting checks
npm run typecheck         # Run TypeScript type checking

# Cleanup
npm run clean             # Clean test artifacts
npm run clean:all         # Clean all artifacts and dependencies
```

## CI/CD Setup

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow that:

1. **Setup Phase**
   - Installs Node.js and dependencies
   - Sets up Appium server
   - Creates Android emulator
   - Starts required services

2. **Test Execution**
   - Runs tests in parallel across environments
   - Captures screenshots and videos
   - Generates comprehensive reports

3. **Reporting**
   - Uploads test artifacts
   - Generates Allure reports
   - Sends notifications

### Workflow Triggers

- **Push** to main/develop branches
- **Pull requests** to main/develop branches
- **Daily schedule** (2 AM UTC)
- **Manual trigger** with environment selection

### Setup Requirements

1. **Secrets Configuration**

   ```yaml
   # In GitHub repository settings
   SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
   ```

2. **Environment Files**
   Create environment-specific test data files in `test/data/`

## Reporting

### Allure Reports

```bash
# Generate and open Allure report
npm run report:allure

# Generate report only
allure generate allure-results --clean
```

### JUnit Reports

```bash
# View JUnit reports
npm run report:junit
```

### Test Artifacts

- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`
- **Allure Results**: `allure-results/`
- **JUnit Results**: `test-results/junit/`
- **Logs**: `logs/`

## Development

### Adding New Page Objects

1. **Create page class following Industry Standard POM Pattern**

   ```javascript
   class NewPage {
     // Element selectors - Clean and readable
     get selectors() {
       return {
         elementOne: 'id=your-element-id',
         elementTwo: 'android=new UiSelector().text("Your Text")',
         dynamicElement: index =>
           `android=new UiSelector().className("android.widget.EditText").instance(${index})`,
       };
     }

     // String constants - Centralized strings
     get strings() {
       return {
         defaultValue: 'default-text',
         expectedTitle: 'Expected Page Title',
         errorMessage: 'Operation failed',
       };
     }

     // Element getters - Clean access to elements
     get elementOne() {
       return $(this.selectors.elementOne);
     }

     get elementTwo() {
       return $(this.selectors.elementTwo);
     }

     // Actions - Business logic separated from selectors
     async performAction() {
       console.log('Performing action on element');
       await this.elementOne.safeClick();
     }

     async enterData(data) {
       console.log(`Entering data: ${data}`);
       await this.elementTwo.clearAndType(data);
     }

     async getDynamicElement(index) {
       return $(this.selectors.dynamicElement(index));
     }
   }

   export default new NewPage();
   ```

2. **Add corresponding tests with Modern ES6 Imports**

   ```javascript
   // Modern ES6 import style (no .js extension)
   import NewPage from '../screenObjects/NewPage';
   import { BaseTest } from '../testObjects/BaseTest';

   describe('New Page Tests', () => {
     it('should perform action using industry standard POM', async () => {
       // Verify proper structure
       expect(NewPage.selectors.elementOne).toBeDefined();
       expect(NewPage.strings.defaultValue).toBe('default-text');

       // Use clean actions
       await NewPage.performAction();
       await NewPage.enterData('test data');
     });
   });
   ```

### Modern ES6 Import Patterns

```javascript
// CORRECT - Modern ES6 style (what we implemented)
import LoginScreen from '../screenObjects/android/LoginScreen.js';
import CartScreenLogin from '../screenObjects/android/cart-login-screen.js';
import HomeScreen from '../screenObjects/android/HomeScreen.js';
import BaseTest from '../testObjects/BaseTest.js';
import TestDataManager from '../data/TestDataManager.js';

// WORKING - Configuration imports
import EnvironmentConfig from './test/config/environment.js';

// NOT WORKING - Without .js extensions
import LoginScreen from '../screenObjects/android/LoginScreen';
```

### Industry Standard POM Structure

PageObjectName.js
├── get selectors()          # All element locators
│   └── elementName: 'locator'
├── get strings()            # All string constants
│   └── constantName: 'value'
├── get elementName()        # Element getters
│   └── return $(selector)
└── async methodName()       # Business actions
    └── await element.action()

### Adding Custom Commands

```javascript
// In test/commands/enhanced-commands.js
browser.addCommand('customAction', async function (param) {
  // Implementation
  console.log(`Custom action with param: ${param}`);
});
```

### Test Data Management

```javascript
// Add to test/data/base-test-data.json
{
  "customData": {
    "testValue": "your-value"
  }
}

// Use in tests
import TestDataManager from '../../data/TestDataManager.js';
const value = TestDataManager.getData('testValue', 'customData');
```

## Architecture

### Page Object Model

BasePage (base functionality)
├── LoginScreen (extends BasePage)
├── HomeScreen (extends BasePage)
├── CartScreen (extends BasePage)
└── ...

### Test Structure

BaseTest (test utilities)
├── LoginTest (extends BaseTest)
├── NavigationTest (extends BaseTest)
└── ...

### Configuration Hierarchy

EnvironmentConfig (environment-specific)
├── Local Config
├── Stage Config
└── Production Config

## Best Practices

### Test Organization

- Use descriptive test names
- Group related tests in describe blocks
- Use before/after hooks appropriately
- Keep tests independent and isolated

### Page Objects

- One page object per screen/page
- Use descriptive element names
- Implement proper wait strategies
- Include error handling

### Test Data

- Use external test data files
- Avoid hardcoded values in tests
- Implement data-driven testing
- Use random data for unique scenarios

### Error Handling

- Implement proper exception handling
- Take screenshots on failures
- Log meaningful error messages
- Use retry mechanisms for flaky tests

### Maintenance

- Regularly update dependencies
- Review and update selectors
- Clean up old test artifacts
- Document framework changes

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
   bash
   git checkout -b feature/new-feature

3. **Make your changes**
4. **Add tests for new functionality**
5. **Run the test suite**
   bash
   npm run validate

6. **Commit your changes**
   bash
   git commit -am 'Add new feature'

7. **Push to the branch**
   bash
   git push origin feature/new-feature

8. **Create a Pull Request**

### Code Style

- Use ESLint for code formatting
- Follow existing naming conventions
- Add comments for complex logic
- Use meaningful variable names

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check existing documentation

## License

This project is licensed under the ISC License - see the LICENSE file for details.
**Built with using WebDriverIO, Appium, and modern JavaScript**

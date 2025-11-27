/**
 * Base Test Class
 * Provides common functionality for all test classes
 */
class BaseTest {
  constructor() {
    this.testData = {};
    this.screenshotDir = './test-results/screenshots';
  }

  /**
   * Setup before each test
   */
  async beforeEach() {
    // Initialize test data
    this.testData = {};

    // Set implicit timeout
    await browser.setTimeout({ implicit: 10000 });

    // Maximize window for web tests (if applicable)
    try {
      await browser.maximizeWindow();
    } catch (error) {
      // Ignore for mobile tests
    }

    console.log('\x1b[32mTest setup completed\x1b[0m');
  }

  /**
   * Cleanup after each test
   */
  async afterEach() {
    // Take screenshot on failure
    if (browser.isTestFailed && browser.isTestFailed()) {
      await this.takeScreenshot(`test_failure_${Date.now()}`);
    }

    // Clear test data
    this.testData = {};

    console.log('\x1b[32mTest cleanup completed\x1b[0m');
  }

  /**
   * Setup before test suite
   */
  async beforeSuite() {
    console.log('\x1b[34mStarting test suite...\x1b[0m');

    // Load environment-specific configuration
    this.loadEnvironmentConfig();

    // Initialize reporting
    await this.initializeReporting();
  }

  /**
   * Cleanup after test suite
   */
  async afterSuite() {
    console.log('\x1b[32mTest suite completed\x1b[0m');

    // Generate final reports
    await this.generateFinalReport();
  }

  /**
   * Load environment-specific configuration
   */
  loadEnvironmentConfig() {
    const env = process.env.ENVIRONMENT || 'local';
    console.log(`\x1b[36mLoading configuration for environment: ${env}\x1b[0m`);

    // Environment-specific settings can be loaded here
    switch (env) {
      case 'local':
        this.config = {
          timeout: 30000,
          retryCount: 1,
          enableScreenshots: true,
        };
        break;
      case 'stage':
        this.config = {
          timeout: 45000,
          retryCount: 2,
          enableScreenshots: true,
        };
        break;
      case 'prod':
        this.config = {
          timeout: 60000,
          retryCount: 3,
          enableScreenshots: false,
        };
        break;
      default:
        this.config = {
          timeout: 30000,
          retryCount: 1,
          enableScreenshots: true,
        };
    }
  }

  /**
   * Initialize reporting
   */
  async initializeReporting() {
    // Initialize Allure reporting
    if (global.allure) {
      global.allure.startSuite('Automation Test Suite');
    }
  }

  /**
   * Generate final report
   */
  async generateFinalReport() {
    if (global.allure) {
      global.allure.endSuite();
    }
  }

  /**
   * Take screenshot with test context
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      const filepath = `${this.screenshotDir}/${filename}`;

      await browser.saveScreenshot(filepath);
      console.log(`\x1b[32mScreenshot saved: ${filepath}\x1b[0m`);

      // Attach to Allure report
      if (global.allure) {
        global.allure.addAttachment('Screenshot', filepath, 'image/png');
      }

      return filepath;
    } catch (error) {
      console.error(`Failed to take screenshot: ${error.message}`);
    }
  }

  /**
   * Add step to test report
   * @param {string} stepName - Name of the step
   * @param {Function} stepFunction - Function to execute
   */
  async addStep(stepName, stepFunction) {
    console.log(`\x1b[36mStep: ${stepName}\x1b[0m`);

    if (global.allure) {
      global.allure.startStep(stepName);
    }

    try {
      const result = await stepFunction();
      if (global.allure) {
        global.allure.endStep('passed');
      }
      return result;
    } catch (error) {
      if (global.allure) {
        global.allure.endStep('failed');
      }
      throw error;
    }
  }

  /**
   * Generate random mobile number for testing
   * @returns {string} - Random mobile number
   */
  generateRandomMobileNumber() {
    // Generate mobile number starting with 6-9
    const prefixes = ['6', '7', '8', '9'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(9, '0');
    return prefix + suffix;
  }

  /**
   * Generate random OTP
   * @returns {string} - Random OTP
   */
  generateRandomOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Wait for condition with custom message
   * @param {Function} condition - Condition to wait for
   * @param {string} message - Custom timeout message
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForCondition(condition, message = 'Condition not met', timeout = 30000) {
    await browser.waitUntil(condition, {
      timeout: timeout,
      timeoutMsg: message,
    });
  }

  /**
   * Retry action with exponential backoff
   * @param {Function} action - Action to retry
   * @param {number} maxRetries - Maximum retries
   * @param {number} baseDelay - Base delay in milliseconds
   */
  async retryAction(action, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed: ${error.message}`);

        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          console.log(`\x1b[33mRetrying in ${delay}ms...\x1b[0m`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Action failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }

  /**
   * Log test information with color coding
   * @param {string} level - Log level (INFO, WARN, ERROR)
   * @param {string} message - Log message
   */
  log(level, message) {
    const timestamp = new Date().toISOString();

    // ANSI color codes
    const colors = {
      INFO: '\x1b[34m',    // Blue
      WARN: '\x1b[33m',    // Yellow
      ERROR: '\x1b[31m',   // Red
      SUCCESS: '\x1b[32m', // Green
      DEBUG: '\x1b[35m'    // Magenta
    };

    const color = colors[level] || '\x1b[37m'; // White for unknown levels
    const reset = '\x1b[0m';

    console.log(`${color}[${timestamp}] [${level}] ${message}${reset}`);

    // Add to Allure report
    if (global.allure) {
      global.allure.addAttachment('Log', `[${level}] ${message}`, 'text/plain');
    }
  }

  /**
   * Assert element is displayed
   * @param {WebdriverIO.Element} element - Element to check
   * @param {string} elementName - Name for error message
   */
  async assertElementDisplayed(element, elementName = 'Element') {
    try {
      const isDisplayed = await element.isDisplayed();
      expect(isDisplayed).toBe(true);
      this.log('INFO', `${elementName} is displayed`);
    } catch (error) {
      await this.takeScreenshot(`${elementName.toLowerCase()}_not_displayed`);
      throw new Error(`${elementName} is not displayed: ${error.message}`);
    }
  }

  /**
   * Assert text contains expected value
   * @param {WebdriverIO.Element} element - Element to check
   * @param {string} expectedText - Expected text
   * @param {string} elementName - Name for error message
   */
  async assertTextContains(element, expectedText, elementName = 'Element') {
    let actualText;
    try {
      actualText = await element.getText();
      expect(actualText).toContain(expectedText);
      this.log('INFO', `${elementName} contains expected text: ${expectedText}`);
    } catch (error) {
      await this.takeScreenshot(`${elementName.toLowerCase()}_text_mismatch`);
      throw new Error(
        `${elementName} text mismatch. Expected to contain: ${expectedText}, Actual: ${actualText || 'Unable to retrieve text'}`
      );
    }
  }
}

export default BaseTest;

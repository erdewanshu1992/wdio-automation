import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import EnvironmentConfig from './test/config/environment.android.js';
import EnvironmentConfigIOS from './test/config/environment.ios.js';
import EnvironmentConfigBrowser from './test/config/environment.browser.js';

/**
 * Enhanced WebDriverIO Configuration
 * Supports multiple environments and advanced features
 */

// ✅ Platform detection must come first before any usage
const isAndroid =
  process.env.PLATFORM === 'android' ||
  process.argv.some(arg => arg.includes('android')) ||
  process.argv.some(arg => arg.includes('test:android'));

const isIOS =
  process.env.PLATFORM === 'ios' ||
  process.argv.some(arg => arg.toLowerCase().includes('ios')) ||
  process.argv.some(arg => arg.includes('test:ios'));

const isBrowser =
  !isAndroid &&
  !isIOS &&
  (process.env.PLATFORM === 'browser' ||
    process.argv.some(arg => arg.includes('browser')) ||
    process.argv.some(arg => arg.includes('test:browser')));

// Get environment configuration - check platform type it's working
// const isIOS = process.env.PLATFORM === 'ios' || process.argv.some(arg => arg.includes('iOS')) || process.argv.some(arg => arg.includes('test:ios'));
// const isBrowser = process.env.PLATFORM === 'browser' || process.argv.some(arg => arg.includes('browser')) || process.argv.some(arg => arg.includes('test:browser'));

let envConfig, envName;
if (isIOS) {
  envConfig = EnvironmentConfigIOS.getCurrentConfig();
  envName = EnvironmentConfigIOS.getEnvironmentName();
} else if (isBrowser) {
  envConfig = EnvironmentConfigBrowser.getCurrentConfig();
  envName = EnvironmentConfigBrowser.getEnvironmentName();
} else {
  envConfig = EnvironmentConfig.getCurrentConfig();
  envName = EnvironmentConfig.getEnvironmentName();
}

console.log(`Starting WebDriverIO tests in ${envName.toUpperCase()} environment`);
if (!isBrowser) {
  console.log(`Appium server: ${envConfig.appium.host}:${envConfig.appium.port}`);
} else {
  console.log(`Browser: ${envConfig.capabilities.browserName || 'Chrome'}`);
}

/**
 * Ensure required directories exist
 */
function ensureDirectoriesExist() {
  const dirs = ['./test-results', './test-results/screenshots', './logs', './allure-results'];

  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

export const config = {
  // Appium Configuration (only for mobile platforms)
  ...(isBrowser
    ? {}
    : {
        appium: {
          command: envConfig.appium.command,
          args: {
            address: envConfig.appium.host,
            port: envConfig.appium.port,
            relaxedSecurity: true,
          },
        },
      }),

  // Runner Configuration
  runner: 'local',
  port: isBrowser ? 4444 : envConfig.appium.port,

  // Test Specifications - Platform specific => Ternary operator in place of multiple if-else statements ( condition ? valueIfTrue : valueIfFalse )
  specs: isIOS
    ? process.env.MOBILE_WEB === 'true'
      ? ['./test/specs/ios-mobile-web/**/*.js']
      : ['./test/specs/iOS/**/*.js']
    : isAndroid
      ? process.env.MOBILE_WEB === 'true'
        ? ['./test/specs/android-mobile-web/**/*.js']
        : ['./test/specs/android/**/*.js']
      : ['./test/specs/browser/**/*.js'],
  // Exclude patterns
  exclude: [
    // Add any files to exclude
  ],

  // Parallel execution
  maxInstances: process.env.MAX_INSTANCES || 5,
  maxInstancesPerCapability: 1,

  // Capabilities based on environment
  capabilities: [envConfig.capabilities],

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logLevels: {
    webdriver: 'info',
    '@wdio/appium-service': 'info',
  },

  // Timeouts - Optimized for session stability
  waitforTimeout: 45000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 5,

  // Base URL (for web tests if needed)
  baseUrl: process.env.BASE_URL || '',

  // Services - Platform specific
  // services: isBrowser ? [] : [
  //     ['appium', {
  //         logPath: './logs/',
  //         args: {
  //             relaxedSecurity: true,
  //             allowInsecure: ['chromedriver_autodownload'],
  //             sessionOverride: true,
  //             logLevel: 'info'
  //         }
  //     }]
  // ],

  //
  // === Services ===
  //
  services: isBrowser
    ? [[process.env.BROWSER === 'firefox' ? 'geckodriver' : 'chromedriver']]
    : [
        [
          'appium',
          {
            logPath: './logs/',
            args: {
              relaxedSecurity: true,
              allowInsecure: ['chromedriver_autodownload'],
              sessionOverride: true,
              logLevel: 'info',
            },
          },
        ],
      ],

  // only chrome
  // services: isBrowser ? [
  // ['chromedriver']
  // ] : [
  // ['appium', {
  //     logPath: './logs/',
  //     args: {
  //         relaxedSecurity: true,
  //         allowInsecure: ['chromedriver_autodownload'],
  //         sessionOverride: true,
  //         logLevel: 'info'
  //     }
  // }]
  // ],

  // only chrome and firefox
  // services: [
  // process.env.BROWSER === 'firefox'
  //     ? ['geckodriver']
  //     : ['chromedriver']
  // ],

  //
  // === Capabilities for mobile browsers when need just uncomment ======
  //
  // capabilities: isAndroid ? [{
  //     platformName: "Android",
  //     browserName: "Chrome",
  //     "appium:deviceName": "emulator-5554",
  //     "appium:automationName": "UiAutomator2"
  // }] : isIOS ? [{
  //     platformName: "iOS",
  //     browserName: "Safari",
  //     "appium:deviceName": "iPhone 17 Pro Max",
  //     "appium:automationName": "XCUITest"
  // }] : [{
  //     browserName: process.env.BROWSER || 'chrome'
  // }],

  // Framework
  framework: 'mocha',

  // Reporters
  reporters: [
    'spec',
    ['allure', envConfig.reporting.allure],
    [
      'junit',
      {
        outputDir: './test-results/junit/',
        outputFileFormat: function (options) {
          return `results-${envName}-${new Date().toISOString().split('T')[0]}.xml`;
        },
      },
    ],
  ],

  // Mocha Options - Optimized timeout for stability
  mochaOpts: {
    ui: 'bdd',
    timeout: 90000, // 90 seconds for better stability
    grep: process.env.GREP || undefined,
    bail: process.env.BAIL === 'true' ? 1 : 0,
    reporter: 'spec',
  },

  // Hooks
  beforeSession: function (config, capabilities, specs) {
    console.log('Setting up test session...');
    console.log('Test specs:', specs);
  },

  before: async function (capabilities, specs) {
    console.log('Initializing test environment...');

    // Ensure required directories exist
    ensureDirectoriesExist();

    // Load custom commands
    await import('./test/utils/enhanced-commands.js');

    // Set timeouts
    await browser.setTimeout({
      implicit: envConfig.timeouts.implicit,
      pageLoad: envConfig.timeouts.pageLoad,
      script: envConfig.timeouts.script,
    });

    console.log('Test environment ready');
  },

  beforeTest: async function (test, context) {
    console.log(`Starting test: ${test.title}`);

    // Take screenshot at test start if enabled and session is valid
    if (envConfig.reporting.enableScreenshots) {
      try {
        // Check if session is valid before taking screenshot
        await browser.status();
        await browser.saveScreenshot(`./test-results/screenshots/${test.title}_start.png`);
      } catch (error) {
        console.log(`Screenshot skipped for ${test.title} - session not ready`);
      }
    }

    // Add test to Allure report
    if (global.allure) {
      global.allure.startTest(test.title);
      global.allure.addLabel('environment', envName);
      global.allure.addLabel('platform', isBrowser ? 'web' : 'mobile');
    }
  },

  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    console.log(
      `Test completed: ${test.title} | Status: ${passed ? 'PASSED' : 'FAILED'} | Duration: ${duration}ms`
    );

    // Take screenshot on failure if session is valid
    if (!passed && envConfig.reporting.enableScreenshots) {
      try {
        // Check if session is valid before taking screenshot
        await browser.status();
        await browser.saveScreenshot(`./test-results/screenshots/${test.title}_failed.png`);
      } catch (screenshotError) {
        console.log(`Screenshot skipped for failed test ${test.title} - session not available`);
      }
    }

    // Add result to Allure report
    if (global.allure) {
      if (error) {
        global.allure.addAttachment('Error', error.message, 'text/plain');
      }
      global.allure.endTest(passed ? 'passed' : 'failed');
    }
  },

  afterHook: async function (test, context, { error, result, duration, passed, retries }) {
    // Handle hook failures
    if (error) {
      console.error(`Hook failed: ${error.message}`);
    }
  },

  onComplete: async function (exitCode, config, capabilities, results) {
    console.log('Test execution completed');

    // Generate summary (handle cases where results might not be available)
    if (results && Array.isArray(results)) {
      const totalTests = results.length;
      const passedTests = results.filter(result => result.passed).length;
      const failedTests = totalTests - passedTests;

      console.log(`Test Summary:`);
      console.log(`   Total: ${totalTests}`);
      console.log(`   Passed: ${passedTests}`);
      console.log(`   Failed: ${failedTests}`);
      console.log(
        `   Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) + '%' : 'N/A'}`
      );
    } else {
      console.log('Test results not available for summary');
    }

    // Environment-specific cleanup
    if (envConfig.reporting.enableScreenshots) {
      console.log('Screenshots saved to: ./test-results/screenshots/');
    }

    console.log('Allure results saved to: allure-results/');
    console.log('JUnit results saved to: test-results/junit/');
  },

  onError: async function (error) {
    console.error('Test execution error:', error.message);

    // Take emergency screenshot if session is valid
    try {
      // Check if session is valid before taking screenshot
      await browser.status();
      await browser.saveScreenshot(`./test-results/screenshots/error_${Date.now()}.png`);
    } catch (screenshotError) {
      console.error(
        'Failed to take error screenshot - session not available:',
        screenshotError.message
      );
    }
  },

  // Custom commands can be added here
  //
  // Example:
  // browser.addCommand('customCommand', async function (param) {
  //     // Custom implementation
  // });
};

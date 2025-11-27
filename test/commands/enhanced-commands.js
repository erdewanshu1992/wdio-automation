/**
 * Enhanced Custom Commands
 * Industry-standard WebDriverIO custom commands
 */

// Import required modules
import EnvironmentConfig from '../config/environment.android.js';
import TestDataManager from '../data/TestDataManager.js';

/**
 * Enhanced Mobile Number Entry with Validation
 */
browser.addCommand('enterMobileNumber', async function (mobileNumber, options = {}) {
  const envConfig = EnvironmentConfig.getCurrentConfig();
  const timeout = options.timeout || 5000;

  // Use environment-specific mobile number if not provided
  if (!mobileNumber) {
    mobileNumber = envConfig.testData.mobileNumber;
  }

  // Validate mobile number format
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobileNumber)) {
    throw new Error(`Invalid mobile number: ${mobileNumber}. Must be 10 digits starting with 6-9.`);
  }

  console.log(`Entering mobile number: ${mobileNumber}`);

  const mobileInput = await $('android=new UiSelector().resourceId("mobileNumber")');

  // Clear and enter mobile number
  await mobileInput.clearValue();
  await mobileInput.setValue(mobileNumber);
  await browser.hideKeyboard();

  // Click continue/get OTP button
  const continueBtn = await $('android=new UiSelector().text("Continue")');
  const getOtpBtn = await $('android=new UiSelector().text("Get OTP")');

  if (await getOtpBtn.isDisplayed()) {
    await getOtpBtn.click();
  } else if (await continueBtn.isDisplayed()) {
    await continueBtn.click();
  } else {
    throw new Error('Neither Continue nor Get OTP button found');
  }

  await browser.pause(timeout);
});

/**
 * Enhanced OTP Entry with Validation
 */
browser.addCommand('enterOtp', async function (otp, options = {}) {
  const envConfig = EnvironmentConfig.getCurrentConfig();
  const timeout = options.timeout || 3000;

  // Use environment-specific OTP if not provided
  if (!otp) {
    otp = envConfig.testData.otp;
  }

  // Validate OTP format
  if (!/^\d{4}$/.test(otp)) {
    throw new Error(`Invalid OTP: ${otp}. Must be exactly 4 digits.`);
  }

  console.log(`Entering OTP: ${otp}`);

  // Enter OTP digits one by one
  for (let i = 0; i < otp.length; i++) {
    const otpInput = await $(
      `android=new UiSelector().className("android.widget.EditText").instance(${i})`
    );
    await otpInput.setValue(otp[i]);
    await browser.pause(500); // Small delay between digits
  }

  await browser.hideKeyboard();
  await browser.pause(timeout);
});

/**
 * Complete Login Flow
 */
browser.addCommand('performLogin', async function (mobileNumber, otp, options = {}) {
  const envConfig = EnvironmentConfig.getCurrentConfig();
  const timeout = options.timeout || 3000;

  // Use environment-specific data if not provided
  if (!mobileNumber) {
    mobileNumber = envConfig.testData.mobileNumber;
  }
  if (!otp) {
    otp = envConfig.testData.otp;
  }

  console.log(`Performing complete login for: ${mobileNumber}`);

  await browser.enterMobileNumber(mobileNumber, { timeout });
  await browser.enterOtp(otp, { timeout });

  // Wait for login to complete
  await browser.pause(2000);

  console.log('Login completed successfully');
});

/**
 * Enhanced Element Commands
 */
browser.addCommand(
  'clearAndType',
  async function (value, options = {}) {
    const timeout = options.timeout || 5000;

    await this.waitForDisplayed({ timeout });
    await this.clearValue();
    await this.setValue(value);
    await browser.hideKeyboard();

    console.log(`Cleared and typed: ${value}`);
  },
  true
); // Element-level command

/**
 * Safe Click with Retry
 */
browser.addCommand(
  'safeClick',
  async function (maxRetries = 3) {
    const envConfig = EnvironmentConfig.getCurrentConfig();
    const retryCount = envConfig.testData.retryCount || 3;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        await this.waitForClickable();
        await this.click();
        console.log(`Clicked successfully on attempt ${attempt}`);
        return;
      } catch (error) {
        console.warn(`Click attempt ${attempt} failed: ${error.message}`);

        if (attempt === retryCount) {
          throw new Error(`Failed to click after ${retryCount} attempts: ${error.message}`);
        }

        await browser.pause(1000 * attempt); // Exponential backoff
      }
    }
  },
  true
); // Element-level command

/**
 * Wait for Element with Custom Message
 */
browser.addCommand(
  'waitForElement',
  async function (customMessage, timeout = 30000) {
    try {
      await this.waitForDisplayed({ timeout });
      console.log(`Element found: ${customMessage || 'Element'}`);
      return true;
    } catch (error) {
      const message = customMessage ? `${customMessage} - ${error.message}` : error.message;
      console.error(`${message}`);
      throw new Error(message);
    }
  },
  true
); // Element-level command

/**
 * Take Screenshot with Context
 */
browser.addCommand('takeScreenshot', async function (context) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${context}_${timestamp}.png`;
  const filepath = `test-results/screenshots/${filename}`;

  await browser.saveScreenshot(filepath);
  console.log(`Screenshot saved: ${filepath}`);

  // Add to Allure report if available
  if (global.allure) {
    global.allure.addAttachment('Screenshot', filepath, 'image/png');
  }

  return filepath;
});

/**
 * Scroll to Element
 */
browser.addCommand(
  'scrollToElement',
  async function () {
    try {
      await this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await browser.pause(1000);
      console.log('Scrolled to element');
    } catch (error) {
      console.error(`Failed to scroll to element: ${error.message}`);
      throw error;
    }
  },
  true
); // Element-level command

/**
 * Device Navigation Commands
 */
browser.addCommand('pressBack', async function () {
  console.log('Pressing back button');
  await browser.back();
});

browser.addCommand('pressHome', async function () {
  console.log('Pressing home button');
  await browser.execute('mobile: shell', {
    command: 'input',
    args: ['keyevent', '3'], // KEYCODE_HOME
  });
});

browser.addCommand('pressEnter', async function () {
  console.log('Pressing enter key');
  await browser.execute('mobile: shell', {
    command: 'input',
    args: ['keyevent', '66'], // KEYCODE_ENTER
  });
});

/**
 * App Management Commands
 */
browser.addCommand('closeApp', async function () {
  console.log('Closing app');
  await browser.closeApp();
});

browser.addCommand('launchApp', async function () {
  console.log('Launching app');
  await browser.launchApp();
});

browser.addCommand('resetApp', async function () {
  console.log('Resetting app');
  await browser.reset();
});

browser.addCommand('activateApp', async function () {
  console.log('Activating app');
  await browser.activateApp();
});

/**
 * Network and Performance Commands
 */
browser.addCommand('enableNetwork', async function () {
  console.log('Enabling network');
  await browser.setNetworkConnection(6); // WiFi + Data
});

browser.addCommand('disableNetwork', async function () {
  console.log('Disabling network');
  await browser.setNetworkConnection(0); // No network
});

browser.addCommand('getPerformanceData', async function (packageName, dataType) {
  console.log(`Getting performance data for ${dataType}`);
  return await browser.execute('mobile: shell', {
    command: 'dumpsys',
    args: ['procstats', packageName],
  });
});

/**
 * Toast Message Capture
 */
browser.addCommand('getToastMessage', async function (timeout = 10000) {
  console.log('Waiting for toast message');
  const toastSelector = 'android.widget.Toast';

  try {
    const toast = await $(`//${toastSelector}[1]`);
    await toast.waitForDisplayed({ timeout, reverse: false });
    const message = await toast.getText();
    console.log(`Toast message: ${message}`);
    return message;
  } catch (error) {
    console.log('No toast message found');
    return null;
  }
});

/**
 * Biometric Authentication (if supported)
 */
browser.addCommand('authenticateBiometric', async function (type = 'fingerprint') {
  console.log(`Authenticating with ${type}`);

  switch (type.toLowerCase()) {
    case 'fingerprint':
      await browser.fingerPrint(1); // Accept fingerprint
      break;
    case 'face':
      await browser.execute('mobile: shell', {
        command: 'input',
        args: ['keyevent', 'KEYCODE_WAKEUP'],
      });
      break;
    default:
      throw new Error(`Unsupported biometric type: ${type}`);
  }
});

/**
 * Data Generation Commands
 */
browser.addCommand('generateRandomMobile', async function () {
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(9, '0');
  return prefix + suffix;
});

browser.addCommand('generateRandomOtp', async function () {
  return Math.floor(1000 + Math.random() * 9000).toString();
});

/**
 * Assertion Commands
 */
browser.addCommand(
  'assertText',
  async function (expectedText) {
    const actualText = await this.getText();
    if (actualText.includes(expectedText)) {
      console.log(`Text assertion passed: "${actualText}" contains "${expectedText}"`);
    } else {
      throw new Error(
        `Text assertion failed. Expected: "${expectedText}", Actual: "${actualText}"`
      );
    }
  },
  true
); // Element-level command

browser.addCommand(
  'assertDisplayed',
  async function () {
    const isDisplayed = await this.isDisplayed();
    if (isDisplayed) {
      console.log('Element is displayed');
    } else {
      throw new Error('Element is not displayed');
    }
  },
  true
); // Element-level command

console.log('Enhanced custom commands loaded successfully');

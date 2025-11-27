/**
 * Base Page Object Class
 * Provides common functionality for all page objects
 */
class BasePage {
  constructor() {
    this.defaultTimeout = 30000;
    this.defaultInterval = 1000;
  }

  // Common selectors that can be used across pages
  get selectors() {
    return {
      // Add common selectors here if needed
    };
  }

  // Common string constants
  get strings() {
    return {
      defaultTimeout: 30000,
      defaultInterval: 1000,
    };
  }

  /**
   * Wait for element to be displayed
   * @param {WebdriverIO.Element} element - Element to wait for
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} - Returns true if element is displayed
   */
  async waitForElement(element, timeout = this.defaultTimeout) {
    try {
      await element.waitForDisplayed({
        timeout: timeout,
        interval: this.defaultInterval,
        reverse: false,
      });
      return true;
    } catch (error) {
      console.error(`Element not found within ${timeout}ms: ${error.message}`);
      return false;
    }
  }

  /**
   * Wait for element to be clickable with session check
   * @param {WebdriverIO.Element} element - Element to wait for
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} - Returns true if element is clickable
   */
  async waitForElementClickable(element, timeout = this.defaultTimeout) {
    try {
      await element.waitForClickable({
        timeout: timeout,
        interval: this.defaultInterval,
        reverse: false,
      });
      return true;
    } catch (error) {
      console.error(`Element not clickable within ${timeout}ms: ${error.message}`);

      // Check if session is still valid
      try {
        await browser.status();
      } catch (sessionError) {
        console.error('Session lost while waiting for element to be clickable');
        throw new Error(`Session lost: ${error.message}`);
      }

      return false;
    }
  }

  /**
   * Safe click with retry mechanism and session recovery
   * @param {WebdriverIO.Element} element - Element to click
   * @param {number} maxRetries - Maximum number of retries
   */
  async safeClick(element, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.waitForElementClickable(element);
        await element.click();
        console.log(`Successfully clicked element on attempt ${attempt}`);
        return;
      } catch (error) {
        console.warn(`Click attempt ${attempt} failed: ${error.message}`);

        // Check if session is still valid
        try {
          await browser.status();
        } catch (sessionError) {
          console.error('Session lost during click attempt');
          throw new Error(`Session lost during click: ${error.message}`);
        }

        if (attempt === maxRetries) {
          throw new Error(`Failed to click element after ${maxRetries} attempts: ${error.message}`);
        }
        await browser.pause(1000); // Wait before retry
      }
    }
  }

  /**
   * Safe set value with clear
   * @param {WebdriverIO.Element} element - Element to set value
   * @param {string} value - Value to set
   * @param {boolean} clearFirst - Whether to clear first
   */
  async safeSetValue(element, value, clearFirst = true) {
    try {
      await this.waitForElement(element);
      if (clearFirst) {
        await element.clearValue();
      }
      await element.setValue(value);
      console.log(`Successfully set value: ${value}`);
    } catch (error) {
      throw new Error(`Failed to set value '${value}': ${error.message}`);
    }
  }

  /**
   * Get element text safely
   * @param {WebdriverIO.Element} element - Element to get text from
   * @returns {Promise<string>} - Element text
   */
  async safeGetText(element) {
    try {
      await this.waitForElement(element);
      return await element.getText();
    } catch (error) {
      console.error(`Failed to get text: ${error.message}`);
      return '';
    }
  }

  /**
   * Check if element exists with better error handling
   * @param {WebdriverIO.Element} element - Element to check
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} - Returns true if element exists
   */
  async isElementExists(element, timeout = 5000) {
    try {
      // First check if the element selector is valid
      if (!element.selector) {
        console.log('Element has no selector, cannot check existence');
        return false;
      }

      await element.waitForExist({ timeout, reverse: false });
      return true;
    } catch (error) {
      // Log the error but don't throw it
      console.log(
        `Element check failed for selector: ${element.selector}, Error: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Scroll to element
   * @param {WebdriverIO.Element} element - Element to scroll to
   */
  async scrollToElement(element) {
    try {
      await element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await browser.pause(1000);
    } catch (error) {
      console.error(`Failed to scroll to element: ${error.message}`);
    }
  }

  /**
   * Take screenshot with timestamp and session validation
   * @param {string} filename - Screenshot filename
   */
  async takeScreenshot(filename) {
    try {
      // Check if session is still valid before taking screenshot
      if (await this.isSessionValid()) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `screenshots/${filename}_${timestamp}.png`;
        await browser.saveScreenshot(screenshotPath);
        console.log(`Screenshot saved: ${screenshotPath}`);
        return screenshotPath;
      } else {
        console.warn(`Session invalid, skipping screenshot: ${filename}`);
        return null;
      }
    } catch (error) {
      console.error(`Failed to take screenshot: ${error.message}`);
      // Try to recover session if possible
      await this.recoverSession();
      throw error;
    }
  }

  /**
   * Check if WebDriver session is still valid
   * @returns {boolean} - True if session is valid
   */
  async isSessionValid() {
    try {
      await browser.status(); // Simple command to test session
      return true;
    } catch (error) {
      if (error.message.includes('invalid session id') || error.message.includes('not known')) {
        return false;
      }
      return true; // Other errors don't necessarily mean invalid session
    }
  }

  /**
   * Attempt to recover from session issues
   */
  async recoverSession() {
    try {
      console.log('Attempting session recovery...');
      // Wait a moment for session to stabilize
      await browser.pause(2000);
      // Check session status
      const status = await browser.status();
      if (status && status.ready) {
        console.log('Session recovered successfully');
      } else {
        console.warn('Session recovery uncertain');
      }
    } catch (error) {
      console.error('Session recovery failed:', error.message);
    }
  }

  /**
   * Wait for page to load completely
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForPageLoad(timeout = this.defaultTimeout) {
    await browser.waitUntil(
      async () => {
        const readyState = await browser.execute(() => {
          return document.readyState;
        });
        return readyState === 'complete';
      },
      {
        timeout: timeout,
        timeoutMsg: 'Page did not load completely',
      }
    );
  }

  /**
   * Hide keyboard (mobile)
   */
  async hideKeyboard() {
    try {
      await browser.hideKeyboard();
    } catch (error) {
      // Keyboard might not be visible, ignore error
      console.log('Keyboard not visible or already hidden');
    }
  }

  /**
   * Press device back button
   */
  async pressBack() {
    await browser.back();
  }

  /**
   * Swipe in direction
   * @param {string} direction - Direction to swipe (up, down, left, right)
   */
  async swipe(direction) {
    const { width, height } = await browser.getWindowSize();

    const startX = width / 2;
    const startY = height / 2;
    let endX, endY;

    switch (direction.toLowerCase()) {
      case 'up':
        endX = startX;
        endY = startY - height * 0.3;
        break;
      case 'down':
        endX = startX;
        endY = startY + height * 0.3;
        break;
      case 'left':
        endX = startX - width * 0.3;
        endY = startY;
        break;
      case 'right':
        endX = startX + width * 0.3;
        endY = startY;
        break;
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }

    await browser.touchAction([
      { action: 'press', x: startX, y: startY },
      { action: 'wait', ms: 1000 },
      { action: 'moveTo', x: endX, y: endY },
      'release',
    ]);
  }
}

export default BasePage;

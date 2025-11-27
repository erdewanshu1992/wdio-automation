/**
 * MobileCommandUtil.js
 * WDIO Utility for mobile gestures (Appium 2.x + W3C actions)
 * Compatible with iOS and Android.
 */

class MobileCommandUtil {
  /**
   * Swipe multiple times upward
   * @param {number} times - how many times to swipe up
   */
  static async swipeUpNTimes(times = 1) {
    for (let i = 0; i < times; i++) {
      await driver.execute('mobile: swipe', { direction: 'up' });
      console.log(`Swiped up (${i + 1}/${times})`);
      await driver.pause(1000);
    }
  }

  /**
   * Swipe multiple times downward
   * @param {number} times - how many times to swipe down
   */
  static async swipeDownNTimes(times = 1) {
    for (let i = 0; i < times; i++) {
      await driver.execute('mobile: swipe', { direction: 'down' });
      console.log(`Swiped down (${i + 1}/${times})`);
      await driver.pause(1000);
    }
  }

  /**
   * Tap on specific coordinates
   * @param {number} x
   * @param {number} y
   */
  static async tapCoordinate(x, y) {
    await driver.execute('mobile: tap', { x, y });
    console.log(`Tapped at coordinates (${x}, ${y})`);
  }

  // /**
  //  * Tap on a given element
  //  * @param {WebdriverIO.Element} element
  //  */
  // static async tapOnElement(element) {
  //     await element.waitForDisplayed({ timeout: 5000 });
  //     await driver.execute('mobile: tap', { elementId: element.elementId });
  //     console.log(`Tapped element: ${await element.selector}`);
  // }

  /**
   * Tap on a given element (works for iOS + Android)
   * @param {WebdriverIO.Element} element
   */
  static async tapOnElement(element) {
    await element.waitForDisplayed({ timeout: 5000 });
    const rect = await element.getRect();
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    await driver.execute('mobile: tap', { x: centerX, y: centerY });
    console.log(`Tapped element center at (${centerX}, ${centerY})`);
  }

  /**
   * Long press on element (iOS/Android)
   * @param {WebdriverIO.Element} element
   * @param {number} durationMs - duration in milliseconds
   */
  static async longPressElement(element, durationMs = 2000) {
    await element.waitForDisplayed({ timeout: 5000 });
    await driver.execute('mobile: longClickGesture', {
      elementId: element.elementId,
      duration: durationMs,
    });
    console.log(`Long pressed element for ${durationMs}ms`);
  }

  /**
   * Long press with touchAndHold (iOS only)
   * @param {WebdriverIO.Element} element
   * @param {number} seconds - duration in seconds
   */
  static async longPressTouchAndHold(element, seconds = 2) {
    if (!driver.isIOS) {
      console.warn('touchAndHold is iOS only!');
      return;
    }
    await driver.execute('mobile: touchAndHold', {
      elementId: element.elementId,
      duration: seconds,
    });
    console.log(`touchAndHold on element for ${seconds}s`);
  }

  /**
   * Double tap gesture (iOS)
   * @param {WebdriverIO.Element} element
   */
  static async doubleTap(element) {
    if (!driver.isIOS) {
      console.warn('doubleTap is iOS only!');
      return;
    }
    await driver.execute('mobile: doubleTap', { elementId: element.elementId });
    console.log('Double tapped element');
  }

  /**
   * Tap on center of element (coordinate-based)
   * @param {WebdriverIO.Element} element
   */
  static async tapElementCenter(element) {
    const rect = await element.getRect();
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    await driver.execute('mobile: tap', { x: centerX, y: centerY });
    console.log(`Tapped element center at (${centerX}, ${centerY})`);
  }

  /**
   * Scroll until a specific element (by label/text) is visible (iOS)
   * @param {string} text - label to scroll to
   * @param {string} direction - 'down' or 'up'
   */
  static async scrollUntilVisible(text, direction = 'down') {
    if (!driver.isIOS) {
      console.warn('scroll with predicate is iOS only!');
      return;
    }
    const scrollObject = {
      direction,
      predicateString: `label == '${text}'`,
    };
    await driver.execute('mobile: scroll', scrollObject);
    console.log(`Scrolled ${direction} until element with label "${text}" was visible`);
  }

  /**
   * Swipe generic with direction (for Android or iOS)
   * @param {'up'|'down'|'left'|'right'} direction
   */
  static async swipe(direction = 'up') {
    await driver.execute('mobile: swipe', { direction });
    console.log(`Swiped ${direction}`);
  }
}

export default MobileCommandUtil;

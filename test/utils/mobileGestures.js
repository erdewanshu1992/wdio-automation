/**
 * MobileGestures Utility
 * Supports Appium 2.x + WDIO v8+
 * iOS & Android compatible gesture helpers.
 */

class MobileGestures {
  /**
   * Perform a tap on given coordinates
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  static async tap(x, y) {
    console.log(`Tap at (${x}, ${y})`);
    await driver.execute('mobile: tap', { x, y });
  }

  /**
   * Tap on element (safer alternative to coordinate tap)
   * @param {WebdriverIO.Element} element
   */
  static async tapOnElement(element) {
    await element.waitForDisplayed({ timeout: 5000 });
    await element.click();
    console.log(`Tapped on element: ${await element.selector}`);
  }

  /**
   * Swipe from (startX, startY) to (endX, endY)
   * Works for both Android & iOS
   */
  static async swipe(startX, startY, endX, endY, duration = 1000) {
    console.log(`Swiping from (${startX}, ${startY}) → (${endX}, ${endY})`);
    await driver.execute('mobile: dragFromToForDuration', {
      duration: duration / 1000, // Appium expects seconds
      fromX: startX,
      fromY: startY,
      toX: endX,
      toY: endY,
    });
  }

  /**
   * Swipe up (generic)
   */
  static async swipeUp() {
    const { width, height } = await driver.getWindowRect();
    const startX = width / 2;
    const startY = height * 0.8;
    const endY = height * 0.2;
    await this.swipe(startX, startY, startX, endY);
  }

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
   * Swipe down
   */
  static async swipeDown() {
    const { width, height } = await driver.getWindowRect();
    const startX = width / 2;
    const startY = height * 0.2;
    const endY = height * 0.8;
    await this.swipe(startX, startY, startX, endY);
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
   * Swipe left
   */
  static async swipeLeft() {
    const { width, height } = await driver.getWindowRect();
    const startY = height / 2;
    const startX = width * 0.8;
    const endX = width * 0.2;
    await this.swipe(startX, startY, endX, startY);
  }

  /**
   * Swipe right
   */
  static async swipeRight() {
    const { width, height } = await driver.getWindowRect();
    const startY = height / 2;
    const startX = width * 0.2;
    const endX = width * 0.8;
    await this.swipe(startX, startY, endX, startY);
  }

  /**
   * Long press on element or coordinates
   */
  static async longPress(x, y, duration = 2000) {
    console.log(`Long press at (${x}, ${y}) for ${duration}ms`);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
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
  // static async swipe(direction = 'up') {
  //     await driver.execute('mobile: swipe', { direction });
  //     console.log(`Swiped ${direction}`);
  // }

  /**
   * Tap on specific coordinates
   * @param {number} x
   * @param {number} y
   */
  static async tapCoordinate(x, y) {
    await driver.execute('mobile: tap', { x, y });
    console.log(`Tapped at coordinates (${x}, ${y})`);
  }

  /**
   * Draw signature (example gesture)
   * @param {number} startX - start X
   * @param {number} startY - start Y
   * @param {number} width  - width of signature
   * @param {number} height - height of signature
   */
  static async drawSignature(startX = 50, startY = 300, width = 300, height = 100) {
    console.log('Drawing signature...');
    const steps = 5;
    const xStep = width / steps;
    const yStep = height / steps;

    const actions = [
      { type: 'pointerMove', duration: 0, x: startX, y: startY },
      { type: 'pointerDown', button: 0 },
    ];

    for (let i = 1; i <= steps; i++) {
      actions.push({
        type: 'pointerMove',
        duration: 100,
        x: startX + xStep * i,
        y: startY + yStep * i,
      });
    }

    actions.push({ type: 'pointerUp', button: 0 });

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions,
      },
    ]);
    await driver.releaseActions();
    console.log('Signature drawn');
  }

  /**
   * Pinch or zoom gesture
   * @param {'in'|'out'} type
   */
  static async pinchOrZoom(type = 'in') {
    console.log(`Performing ${type === 'in' ? 'pinch' : 'zoom'}`);

    const { width, height } = await driver.getWindowRect();
    const centerX = width / 2;
    const centerY = height / 2;

    const finger1Start = { x: centerX, y: centerY };
    const finger2Start = { x: centerX, y: centerY };

    const finger1End =
      type === 'in' ? { x: centerX, y: centerY - 200 } : { x: centerX, y: centerY + 200 };
    const finger2End =
      type === 'in' ? { x: centerX, y: centerY + 200 } : { x: centerX, y: centerY - 200 };

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, ...finger1Start },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, ...finger1End },
          { type: 'pointerUp', button: 0 },
        ],
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, ...finger2Start },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 500, ...finger2End },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
  }
}

export default MobileGestures;

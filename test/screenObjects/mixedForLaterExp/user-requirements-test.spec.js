import { $ } from '@wdio/globals';
import EnvironmentConfigIOS from '../../config/environment.ios.js';
import MobileGestures from '../../utils/mobileGestures.js';
import MobileCommandUtil from '../../utils/MobileCommandUtil.js';

describe('SwagLabs Mobile App - iOS Tests', () => {
  before(async () => {
    console.log('Starting iOS test session...');
    console.log('Environment:', EnvironmentConfigIOS.getEnvironmentName());
    console.log('Capabilities:', JSON.stringify(EnvironmentConfigIOS.getCapabilities(), null, 2));
  });

  beforeEach(async () => {
    try {
      // Wait for app to load
      await browser.pause(2000);
      console.log('App loaded successfully');
    } catch (error) {
      console.error('Failed in beforeEach hook:', error.message);
      throw error;
    }
  });

  describe('SwagLabs Mobile Gestures Demo', () => {
    it('should perform basic gestures', async () => {
      const username = await $('~test-Username');
      await username.setValue('standard_user');

      const password = await $('~test-Password');
      await password.setValue('secret_sauce');

      const loginButton = await $('~test-LOGIN');
      await MobileCommandUtil.tapOnElement(loginButton);

      await MobileGestures.swipeUp();
      await MobileGestures.tap(100, 200);
      await MobileGestures.longPress(200, 300);
      await MobileCommandUtil.tapCoordinate(19, 60);
      await $(`//XCUIElementTypeOther[@name="test-DRAWING"]`).click({ timeout: 2000 });
      await MobileGestures.drawSignature();
      await MobileGestures.pinchOrZoom('out');

      // await MobileCommandUtil.swipeUpNTimes(2);
      // await MobileCommandUtil.swipeDownNTimes(2);

      // // await MobileCommandUtil.tapCoordinate(19, 60);

      // const item = await $('//XCUIElementTypeStaticText[@name="test-Item title" and @label="Sauce Labs Backpack"]');
      // await item.waitForDisplayed({ timeout: 5000 });

      // await item.click();
      // await MobileGestures.longPress(200, 300);

      // await MobileCommandUtil.tapCoordinate(19, 60);

      // await MobileCommandUtil.longPressElement(item, 1500);

      if (driver.isIOS) {
        await MobileCommandUtil.doubleTap(item);
        await MobileCommandUtil.scrollUntilVisible('Chai', 'down');
      }
    });
  });

  describe.x('SwagLabs App Feature Tests', () => {
    it('should test all SwagLabs features', async () => {
      console.log('Starting comprehensive SwagLabs feature test');

      try {
        const username = await $('~test-Username');
        await username.setValue('standard_user');

        const password = await $('~test-Password');
        await password.setValue('secret_sauce');

        const loginButton = await $('~test-LOGIN');
        await MobileGestures.tapOnElement(loginButton);

        await MobileGestures.swipeUp();
        await MobileGestures.tap(100, 200);
        await MobileGestures.longPress(200, 300);
        await MobileGestures.drawSignature();
        await MobileGestures.pinchOrZoom('out');
      } catch (error) {
        console.error('Test failed:', error.message);
        throw error;
      }
    });
  });

  describe.x('SwagLabs App Feature Tests', () => {
    it('should test all SwagLabs features', async () => {
      console.log('Starting comprehensive SwagLabs feature test');

      try {
        // Step 1: Login credentials input
        console.log('\nSTEP 1: Entering login credentials...');

        // Enter username
        const usernameField = await $('//XCUIElementTypeTextField[@name="test-Username"]');
        await usernameField.waitForDisplayed({ timeout: 10000 });
        await usernameField.setValue('standard_user');
        console.log('Username entered');

        // Enter password
        const passwordField = await $('//XCUIElementTypeSecureTextField[@name="test-Password"]');
        await passwordField.waitForDisplayed({ timeout: 5000 });
        await passwordField.setValue('secret_sauce');
        console.log('Password entered');

        // Find and tap login button using coordinates (coordinate-based tap)
        console.log('\nSTEP 2: Performing login tap...');
        await browser.touchAction([{ action: 'tap', x: 208, y: 319 }]);
        console.log('Login button tapped via coordinates');

        // Alternative: Find login button by predicate and tap
        // const loginButton = await $('//XCUIElementTypeOther[@name="test-LOGIN"]');
        // await loginButton.waitForDisplayed({ timeout: 5000 });
        // await loginButton.click();

        await browser.pause(2000);

        // Step 3: Product interaction
        console.log('\nSTEP 3: Interacting with products...');

        // Click on Sauce Labs Backpack
        const backpackItem = await $('//XCUIElementTypeStaticText[@label="Sauce Labs Backpack"]');
        await backpackItem.waitForDisplayed({ timeout: 10000 });
        await backpackItem.click();
        console.log('Backpack item clicked');

        // Add to cart
        const addToCartButton = await $('//XCUIElementTypeOther[@name="test-ADD TO CART"]');
        await addToCartButton.waitForDisplayed({ timeout: 5000 });
        await addToCartButton.click();
        console.log('Added to cart');

        // Perform swipe gestures
        console.log('\nSTEP 4: Performing swipe gestures...');
        await browser.touchAction([
          { action: 'press', x: 200, y: 400 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 200 },
          { action: 'release' },
        ]);
        console.log('Swipe up performed');

        await browser.pause(1000);

        await browser.touchAction([
          { action: 'press', x: 200, y: 200 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 400 },
          { action: 'release' },
        ]);
        console.log('Swipe down performed');

        // Back to products
        const backButton = await $('//XCUIElementTypeOther[@name="test-BACK TO PRODUCTS"]');
        await backButton.waitForDisplayed({ timeout: 5000 });
        await backButton.click();
        console.log('Back to products clicked');

        // More swipe gestures
        await browser.touchAction([
          { action: 'press', x: 200, y: 500 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 200 },
          { action: 'release' },
        ]);

        await browser.pause(1000);

        await browser.touchAction([
          { action: 'press', x: 200, y: 200 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 500 },
          { action: 'release' },
        ]);

        // Toggle menu
        console.log('\nSTEP 5: Testing toggle functionality...');
        const toggleButton = await $('//XCUIElementTypeOther[@name="test-Toggle"]');
        await toggleButton.waitForDisplayed({ timeout: 5000 });
        await toggleButton.click();
        console.log('Toggle clicked');

        await browser.pause(2000);

        // More swipes
        await browser.touchAction([
          { action: 'press', x: 200, y: 400 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 200 },
          { action: 'release' },
        ]);

        await browser.touchAction([
          { action: 'press', x: 200, y: 200 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 400 },
          { action: 'release' },
        ]);

        await toggleButton.click();
        console.log('Toggle clicked again');

        // Final swipes
        await browser.touchAction([
          { action: 'press', x: 200, y: 500 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 200 },
          { action: 'release' },
        ]);

        await browser.touchAction([
          { action: 'press', x: 200, y: 200 },
          { action: 'wait', ms: 1000 },
          { action: 'moveTo', x: 200, y: 500 },
          { action: 'release' },
        ]);

        // Touch helper taps
        console.log('\nSTEP 6: Performing coordinate-based taps...');
        await browser.touchAction([{ action: 'tap', x: 32, y: 54 }]);
        console.log('Tap at coordinates (32, 54)');

        await browser.touchAction([{ action: 'tap', x: 66, y: 329 }]);
        console.log('Tap at coordinates (66, 329)');

        // Signature drawing (simplified for WDIO)
        console.log('\nSTEP 7: Drawing signature...');
        // Draw signature in rectangle at (50, 300), width=300, height=100
        await browser.touchAction([
          { action: 'press', x: 50, y: 300 },
          { action: 'wait', ms: 100 },
          { action: 'moveTo', x: 100, y: 320 },
          { action: 'wait', ms: 100 },
          { action: 'moveTo', x: 150, y: 340 },
          { action: 'wait', ms: 100 },
          { action: 'moveTo', x: 200, y: 360 },
          { action: 'wait', ms: 100 },
          { action: 'moveTo', x: 250, y: 380 },
          { action: 'wait', ms: 100 },
          { action: 'moveTo', x: 300, y: 400 },
          { action: 'release' },
        ]);
        console.log('Signature drawn');

        console.log('\n🎉 ALL SWAGLABS FEATURES TESTED SUCCESSFULLY!');
      } catch (error) {
        console.error('Test failed:', error.message);
        throw error;
      }
    });
  });

  after(async () => {
    console.log('iOS test session completed');
  });
});

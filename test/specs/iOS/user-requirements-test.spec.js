import { $ } from '@wdio/globals';
import MobileGestures from '../../utils/mobileGestures.js';

describe('SwagLabs Mobile App - iOS Tests', () => {
  before(async () => {
    console.log('Starting iOS test session...');
    console.log('ENV:', process.env.ENVIRONMENT || 'local');
    console.log('PLATFORM:', process.env.PLATFORM);
  });

  beforeEach(async () => {
    await browser.waitUntil(
      async () => {
        return (await $('~test-Username')).isDisplayed();
      },
      { timeout: 10000 }
    );
    console.log('App ready');
  });

  it('should perform basic gestures', async () => {
    console.log('Starting gesture test');

    const username = await $('~test-Username');
    await username.setValue('standard_user');

    const password = await $('~test-Password');
    await password.setValue('secret_sauce');

    const loginButton = await $('~test-LOGIN');
    await MobileGestures.tapOnElement(loginButton);

    await MobileGestures.swipeUp();
    await MobileGestures.tap(100, 200);
    await MobileGestures.tapCoordinate(19, 60);

    const drawingArea = await $('//XCUIElementTypeOther[@name="test-DRAWING"]');
    await drawingArea.click();

    await MobileGestures.drawSignature();
    await MobileGestures.pinchOrZoom('out');

    if (driver.isIOS) {
      await MobileGestures.doubleTap(drawingArea);
      await MobileGestures.scrollUntilVisible('Chai', 'down');
    }

    console.log('Gesture test completed');
  });

  after(async () => {
    console.log('iOS test session completed');
  });
});

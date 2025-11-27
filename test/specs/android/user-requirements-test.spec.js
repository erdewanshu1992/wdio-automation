import { $ } from '@wdio/globals';
import LoginScreen from '../../screenObjects/android/LoginScreen.js';

describe('Enhanced Login Screen - Clean & Focused', () => {
  beforeEach(async () => {
    await LoginScreen.waitForScreenToLoad();
    await LoginScreen.takeScreenshot('login_screen_ready');
  });

  describe('Essential Login Flow', () => {
    it('should complete essential login flow with exact locators', async () => {
      console.log('\x1b[34mStarting Enhanced Login Flow Test\x1b[0m');

      // STEP 1: Verify mobile input field
      const mobileInput = await $('android=new UiSelector().resourceId("mobileNumber")');
      await mobileInput.setValue('9876543210');

      // STEP 2: Click Get OTP button if available
      const getOtpButton = await $('android=new UiSelector().text("Get OTP")');
      if (await getOtpButton.isDisplayed()) {
        await getOtpButton.click();
        console.log('Get OTP clicked');
      }

      // Wait for potential UI changes after clicking Get OTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('\x1b[32mLOGIN FLOW COMPLETED\x1b[0m');
    });

    it('should test individual components', async () => {
      console.log('Testing individual components...');

      if (await LoginScreen.isElementExists(LoginScreen.skipButton)) await LoginScreen.clickSkip();

      console.log(
        `WhatsApp text found: ${await LoginScreen.isElementExists(LoginScreen.whatsAppText)}`
      );

      console.log(
        `Terms text found: ${await LoginScreen.isElementExists(LoginScreen.termsAndConditionsText)}`
      );
    });

    it('should validate mobile number format', async () => {
      const valid = ['9876543210', '6123456789', '7123456789'];
      const invalid = ['1234567890', '5123456789', '987654321'];

      valid.forEach(n => expect(LoginScreen.isValidMobileNumber(n)).toBe(true));
      invalid.forEach(n => expect(LoginScreen.isValidMobileNumber(n)).toBe(false));

      console.log('\x1b[32mnumber validation done\x1b[0m');
    });
  });

  after(() => console.log('\x1b[32mAndroid test session completed\x1b[0m'));
});

import BasePage from '../base/BasePage.js';

/**
 * Login Screen Page Object - Enhanced and Focused
 * Essential login functionality only
 */
class LoginScreen extends BasePage {
  constructor() {
    super();
    this.screenName = 'LoginScreen';
  }

  // Enhanced selectors with multiple strategies
  get selectors() {
    return {
      // Core input elements - multiple strategies
      mobileNumberInput: [
        'android=new UiSelector().resourceId("mobileNumber")',
        'android=new UiSelector().resourceIdMatches(".*mobile.*")',
        'android=new UiSelector().className("android.widget.EditText")',
      ],

      // Title elements - multiple text variations
      enterMobileTitle: [
        'android=new UiSelector().text("Enter Mobile Number")',
        'android=new UiSelector().textContains("Mobile")',
        'android=new UiSelector().textContains("Enter")',
      ],

      // Action buttons - multiple text variations
      getOtpButton: [
        'android=new UiSelector().text("Get OTP")',
        'android=new UiSelector().textContains("OTP")',
        'android=new UiSelector().textContains("Get")',
        'android=new UiSelector().className("android.widget.Button")',
      ],

      skipButton: [
        'android=new UiSelector().text("SKIP")',
        'android=new UiSelector().textContains("SKIP")',
        'android=new UiSelector().textContains("Skip")',
      ],

      // Text elements - multiple variations
      whatsAppText: [
        'android=new UiSelector().text("Get order updates on ")',
        'android=new UiSelector().textContains("WhatsApp")',
        'android=new UiSelector().textContains("order updates")',
      ],

      termsAndConditionsText: [
        'android=new UiSelector().textContains("Terms")',
        'android=new UiSelector().textContains("Privacy")',
        'android=new UiSelector().textContains("continuing")',
        'android=new UiSelector().text("By continuing, you agree to our Terms & Conditions  and Privacy Policy")',
      ],

      // Country code
      countryCodePrefix: [
        'android=new UiSelector().text("+91")',
        'android=new UiSelector().textContains("+91")',
      ],
    };
  }

  // Enhanced element getters with fallback strategies
  get mobileNumberInput() {
    return this.findElementWithFallback(this.selectors.mobileNumberInput);
  }

  get enterMobileTitle() {
    return this.findElementWithFallback(this.selectors.enterMobileTitle);
  }

  get getOtpButton() {
    return this.findElementWithFallback(this.selectors.getOtpButton);
  }

  get skipButton() {
    return this.findElementWithFallback(this.selectors.skipButton);
  }

  get whatsAppText() {
    return this.findElementWithFallback(this.selectors.whatsAppText);
  }

  get termsAndConditionsText() {
    return this.findElementWithFallback(this.selectors.termsAndConditionsText);
  }

  get countryCodePrefix() {
    return this.findElementWithFallback(this.selectors.countryCodePrefix);
  }

  /**
   * Find element using multiple selector strategies with session recovery
   * @param {Array} selectors - Array of selector strings
   * @returns {WebdriverIO.Element} - First working element
   */
  findElementWithFallback(selectors) {
    if (Array.isArray(selectors)) {
      for (const selector of selectors) {
        try {
          console.log(`Trying selector: ${selector}`);
          const element = $(selector);
          // Test if element exists by checking if it can be found
          element.selector = selector;
          return element;
        } catch (error) {
          console.log(`Selector failed: ${selector}, trying next...`);

          // Check if session is still valid
          if (error.message.includes('invalid session id') || error.message.includes('not known')) {
            console.error('Session lost during element search');
            this.recoverSession();
            throw new Error(`Session lost during element search: ${error.message}`);
          }
        }
      }
      throw new Error(`No working selector found for element. Tried: ${selectors.join(', ')}`);
    }
    return $(selectors);
  }

  // Essential methods only - focused and clean
  async enterMobileNumber(mobileNumber) {
    console.log(`Entering mobile number: ${mobileNumber}`);
    await this.safeSetValue(this.mobileNumberInput, mobileNumber);
    await this.hideKeyboard();
  }

  async clickGetOtp() {
    console.log('Clicking Get OTP button');
    await this.safeClick(this.getOtpButton);
    await this.takeScreenshot('get_otp_clicked');
  }

  async clickSkip() {
    console.log('Clicking SKIP button');
    await this.safeClick(this.skipButton);
  }

  async enterMobileAndClickGetOtp(mobileNumber) {
    console.log(`Entering mobile ${mobileNumber} and clicking Get OTP`);
    await this.enterMobileNumber(mobileNumber);
    await this.clickGetOtp();
  }

  async clickTermsAndConditions() {
    console.log('Clicking Terms & Conditions link');
    // Use resilient selector with fallback to avoid parsing issues on special characters
    const termsLink = this.termsAndConditionsText;
    await this.safeClick(termsLink);
    await browser.pause(3000);
    await this.takeScreenshot('terms_page');
    await browser.back();
    await browser.pause(2000);
  }

  async verifyEssentialElements() {
    const elements = {};

    try {
      elements.mobileInput = await this.isElementExists(this.mobileNumberInput, 5000);
    } catch (error) {
      console.log('Error checking mobile input:', error.message);
      elements.mobileInput = false;
    }

    try {
      elements.getOtpButton = await this.isElementExists(this.getOtpButton, 5000);
    } catch (error) {
      console.log('Error checking get OTP button:', error.message);
      elements.getOtpButton = false;
    }

    try {
      elements.skipButton = await this.isElementExists(this.skipButton, 5000);
    } catch (error) {
      console.log('Error checking skip button:', error.message);
      elements.skipButton = false;
    }

    try {
      elements.title = await this.isElementExists(this.enterMobileTitle, 5000);
    } catch (error) {
      console.log('Error checking title:', error.message);
      elements.title = false;
    }

    try {
      elements.whatsappText = await this.isElementExists(this.whatsAppText, 5000);
    } catch (error) {
      console.log('Error checking WhatsApp text:', error.message);
      elements.whatsappText = false;
    }

    try {
      elements.termsText = await this.isElementExists(this.termsAndConditionsText, 5000);
    } catch (error) {
      console.log('Error checking terms text:', error.message);
      elements.termsText = false;
    }

    console.log('Essential elements status:', elements);
    return elements;
  }

  async waitForScreenToLoad() {
    await this.waitForElement(this.mobileNumberInput, 15000);
    console.log('Login screen loaded');
  }

  /**
   * Inspect current screen elements for debugging
   */
  async inspectScreenElements() {
    console.log('Inspecting screen elements...');

    const elements = {};

    // Get all text elements on screen
    try {
      const allTexts = await $$('android=new UiSelector().className("android.widget.TextView")');
      console.log(`Found ${allTexts.length} text elements`);

      for (let i = 0; i < Math.min(allTexts.length, 10); i++) {
        try {
          const text = await allTexts[i].getText();
          if (text && text.trim()) {
            console.log(`Text ${i}: "${text}"`);
            elements[`text_${i}`] = text;
          }
        } catch (error) {
          console.log(`Could not get text for element ${i}`);
        }
      }
    } catch (error) {
      console.log('Could not get text elements:', error.message);
    }

    // Get all button elements
    try {
      const allButtons = await $$('android=new UiSelector().className("android.widget.Button")');
      console.log(`Found ${allButtons.length} button elements`);

      for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
        try {
          const text = await allButtons[i].getText();
          console.log(`Button ${i}: "${text}"`);
          elements[`button_${i}`] = text;
        } catch (error) {
          console.log(`Could not get text for button ${i}`);
        }
      }
    } catch (error) {
      console.log('Could not get button elements:', error.message);
    }

    // Get all input elements
    try {
      const allInputs = await $$('android=new UiSelector().className("android.widget.EditText")');
      console.log(`Found ${allInputs.length} input elements`);

      for (let i = 0; i < Math.min(allInputs.length, 5); i++) {
        try {
          const text = (await allInputs[i].getAttribute('resource-id')) || `input_${i}`;
          console.log(`Input ${i}: ${text}`);
          elements[`input_${i}`] = text;
        } catch (error) {
          console.log(`Could not get info for input ${i}`);
        }
      }
    } catch (error) {
      console.log('Could not get input elements:', error.message);
    }

    console.log('Screen inspection complete');
    return elements;
  }

  isValidMobileNumber(mobileNumber) {
    return /^[6-9]\d{9}$/.test(mobileNumber);
  }
}

export default new LoginScreen();

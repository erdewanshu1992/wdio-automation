import BasePage from '../base/BasePage.js';

/**
 * Home Screen Page Object - Enhanced and Focused
 * Essential home screen functionality only
 */
class HomeScreen extends BasePage {
  constructor() {
    super();
    this.screenName = 'HomeScreen';
  }

  // Essential selectors only
  get selectors() {
    return {
      // Core navigation
      homeTab: 'android=new UiSelector().text("Home")',
      servicesTab: 'android=new UiSelector().text("Services")',
      cartTab: 'android=new UiSelector().text("Cart")',
      profileTab: 'android=new UiSelector().text("Profile")',

      // Core services
      beautyServices: 'android=new UiSelector().text("Beauty")',
      searchInput: 'id=yesmadamservices.app.com.yesmadamservices:id/search_input',
      locationText: 'id=yesmadamservices.app.com.yesmadamservices:id/location_text',
    };
  }

  // Essential element getters only
  get homeTab() {
    return $(this.selectors.homeTab);
  }

  get servicesTab() {
    return $(this.selectors.servicesTab);
  }

  get cartTab() {
    return $(this.selectors.cartTab);
  }

  get profileTab() {
    return $(this.selectors.profileTab);
  }

  get beautyServices() {
    return $(this.selectors.beautyServices);
  }

  get searchInput() {
    return $(this.selectors.searchInput);
  }

  get locationText() {
    return $(this.selectors.locationText);
  }

  // Essential methods only - clean and focused
  async navigateToHome() {
    console.log('Navigating to Home tab');
    await this.safeClick(this.homeTab);
  }

  async navigateToServices() {
    console.log('Navigating to Services tab');
    await this.safeClick(this.servicesTab);
  }

  async navigateToCart() {
    console.log('Navigating to Cart tab');
    await this.safeClick(this.cartTab);
  }

  async navigateToProfile() {
    console.log('Navigating to Profile tab');
    await this.safeClick(this.profileTab);
  }

  async selectBeautyServices() {
    console.log('Selecting Beauty services');
    await this.safeClick(this.beautyServices);
  }

  async searchForServices(searchTerm) {
    console.log(`Searching for: ${searchTerm}`);
    await this.safeSetValue(this.searchInput, searchTerm);
    await this.hideKeyboard();
  }

  async getCurrentLocation() {
    try {
      const location = await this.locationText.getText();
      console.log(`Current location: ${location}`);
      return location;
    } catch (error) {
      console.log('Location not available');
      return '';
    }
  }

  async waitForHomeScreen() {
    await this.waitForElement(this.homeTab, 15000);
    console.log('Home screen loaded');
  }

  async verifyHomeElements() {
    const elements = {
      homeTab: await this.isElementExists(this.homeTab, 5000),
      servicesTab: await this.isElementExists(this.servicesTab, 5000),
      cartTab: await this.isElementExists(this.cartTab, 5000),
      profileTab: await this.isElementExists(this.profileTab, 5000),
      beautyServices: await this.isElementExists(this.beautyServices, 5000),
      searchInput: await this.isElementExists(this.searchInput, 5000),
    };
    console.log('Home elements status:', elements);
    return elements;
  }
}

export default new HomeScreen();

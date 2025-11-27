/**
 * Test Data Manager
 * Centralized test data management system
 */
import fs from 'fs';
import path from 'path';

class TestDataManager {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'test', 'data');
    this.currentEnv = process.env.ENVIRONMENT || 'local';
    this.testData = {};
    this.loadTestData();
  }

  /**
   * Load test data based on environment
   */
  loadTestData() {
    try {
      // Load base test data
      const baseDataPath = path.join(this.dataPath, 'base-test-data.json');
      if (fs.existsSync(baseDataPath)) {
        const baseData = JSON.parse(fs.readFileSync(baseDataPath, 'utf8'));
        this.testData = { ...baseData };
      }

      // Load environment-specific test data
      const envDataPath = path.join(this.dataPath, `${this.currentEnv}-test-data.json`);
      if (fs.existsSync(envDataPath)) {
        const envData = JSON.parse(fs.readFileSync(envDataPath, 'utf8'));
        this.testData = { ...this.testData, ...envData };
      }

      console.log(`Test data loaded for environment: ${this.currentEnv}`);
    } catch (error) {
      console.error('Failed to load test data:', error.message);
      this.testData = {};
    }
  }

  /**
   * Get test data by key
   * @param {string} key - Data key
   * @param {string} category - Data category
   * @returns {*} - Test data value
   */
  getData(key, category = 'common') {
    const categoryData = this.testData[category];
    if (!categoryData) {
      throw new Error(`Test data category '${category}' not found`);
    }

    const value = categoryData[key];
    if (value === undefined) {
      throw new Error(`Test data key '${key}' not found in category '${category}'`);
    }

    return value;
  }

  /**
   * Get user data
   * @param {string} userType - Type of user (valid, invalid, etc.)
   * @returns {Object} - User data object
   */
  getUserData(userType = 'valid') {
    return this.getData(userType, 'users');
  }

  /**
   * Get mobile number
   * @param {string} type - Type of mobile number
   * @returns {string} - Mobile number
   */
  getMobileNumber(type = 'valid') {
    return this.getData(type, 'mobileNumbers');
  }

  /**
   * Get OTP
   * @param {string} type - Type of OTP
   * @returns {string} - OTP
   */
  getOtp(type = 'valid') {
    return this.getData(type, 'otp');
  }

  /**
   * Get random test data
   * @param {string} dataType - Type of data to generate
   * @returns {*} - Random test data
   */
  getRandomData(dataType) {
    switch (dataType) {
      case 'mobile':
        return this.generateRandomMobileNumber();
      case 'otp':
        return this.generateRandomOtp();
      case 'email':
        return this.generateRandomEmail();
      case 'name':
        return this.generateRandomName();
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  /**
   * Generate random mobile number
   * @returns {string} - Random mobile number
   */
  generateRandomMobileNumber() {
    const prefixes = ['6', '7', '8', '9'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(9, '0');
    return prefix + suffix;
  }

  /**
   * Generate random OTP
   * @returns {string} - Random OTP
   */
  generateRandomOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Generate random email
   * @returns {string} - Random email
   */
  generateRandomEmail() {
    const domains = ['test.com', 'example.com', 'sample.org'];
    const randomString = Math.random().toString(36).substring(2, 8);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomString}@${domain}`;
  }

  /**
   * Generate random name
   * @returns {string} - Random name
   */
  generateRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa'];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  }

  /**
   * Save test result data
   * @param {string} testName - Name of the test
   * @param {Object} data - Data to save
   */
  saveTestResult(testName, data) {
    const resultsPath = path.join(this.dataPath, 'results');
    if (!fs.existsSync(resultsPath)) {
      fs.mkdirSync(resultsPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testName}_${timestamp}.json`;
    const filepath = path.join(resultsPath, filename);

    const resultData = {
      testName,
      environment: this.currentEnv,
      timestamp: new Date().toISOString(),
      data,
    };

    fs.writeFileSync(filepath, JSON.stringify(resultData, null, 2));
    console.log(`Test result saved: ${filepath}`);
  }

  /**
   * Get all test data categories
   * @returns {Array} - Array of category names
   */
  getCategories() {
    return Object.keys(this.testData);
  }

  /**
   * Get all keys in a category
   * @param {string} category - Category name
   * @returns {Array} - Array of keys
   */
  getKeysInCategory(category) {
    const categoryData = this.testData[category];
    return categoryData ? Object.keys(categoryData) : [];
  }

  /**
   * Validate test data structure
   * @returns {boolean} - True if valid
   */
  validateTestData() {
    try {
      // Check for required categories
      const requiredCategories = ['users', 'mobileNumbers', 'otp'];
      for (const category of requiredCategories) {
        if (!this.testData[category]) {
          console.warn(`Missing required test data category: ${category}`);
        }
      }

      console.log('Test data validation completed');
      return true;
    } catch (error) {
      console.error('Test data validation failed:', error.message);
      return false;
    }
  }

  /**
   * Reload test data
   */
  reloadTestData() {
    console.log('Reloading test data...');
    this.testData = {};
    this.loadTestData();
  }

  /**
   * Print test data summary
   */
  printSummary() {
    console.log('Test Data Summary:');
    console.log(`Environment: ${this.currentEnv}`);
    console.log(`Categories: ${this.getCategories().join(', ')}`);

    this.getCategories().forEach(category => {
      const keys = this.getKeysInCategory(category);
      console.log(`  ${category}: ${keys.length} entries`);
    });
  }
}

// Export singleton instance
export default new TestDataManager();

import dotenv from 'dotenv';
dotenv.config();

import Android from './test/config/environment.android.js';
import IOS from './test/config/environment.ios.js';
import Browser from './test/config/environment.browser.js';
import devices from './test/config/devices.js';

// DO NOT OVERRIDE PLATFORM
const platform = (process.env.PLATFORM || 'android').toLowerCase();

// Select correct environment
const env =
    platform === 'ios' ? IOS :
    platform === 'browser' ? Browser :
    Android;

// Specs per platform
const specs = {
    android: './test/specs/android/**/*.js',
    ios: './test/specs/ios/**/*.js',
    'android-web': './test/specs/android-mobile-web/**/*.js',
    'ios-web': './test/specs/ios-mobile-web/**/*.js',
    browser: './test/specs/browser/**/*.js'
};

export const config = {
    runner: 'local',

    specs: [
        process.env.MOBILE_WEB === 'true'
            ? specs[platform + '-web']
            : specs[platform]
    ],

    // maxInstances: devices.filter(d => d.platform === platform).length,
    maxInstances: platform === 'browser' ? 1 : devices.filter(d => d.platform === platform).length,

    capabilities: platform === 'browser' ? 
        [
            { browserName: 'chrome', maxInstances: 1 },
            { browserName: 'firefox', maxInstances: 1 }
        ]

        // [
        //     {
        //         browserName: 'chrome',
        //         maxInstances: 1,
        //         'goog:chromeOptions': {
        //             args: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
        //         }
        //     },
        //     {
        //         browserName: 'firefox',
        //         maxInstances: 1,
        //         'moz:firefoxOptions': {
        //             args: ['-headless']
        //         }
        //     },
        // ]
        
        : devices
            .filter(d => d.platform === platform)
            .map(d => {
                const caps =
                    typeof env.get('capabilities') === 'function'
                        ? env.get('capabilities')(d)
                        : env.get('capabilities');

                return {
                    ...caps,
                    maxInstances: 1,
                    'appium:deviceName': d.name,
                    'appium:udid': d.udid,
                    'appium:platformVersion': d.version
                };
            }),

    services: platform === 'browser'
        ? ['chromedriver', 'geckodriver']
        : [
            ['appium', {
                args: {
                    relaxedSecurity: true,
                    sessionOverride: true
                }
            }]
        ],

    waitforTimeout: 30000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    framework: 'mocha',
    reporters: ['spec']
};

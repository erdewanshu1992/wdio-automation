import BaseConfig from './base.config.js';
import { existsSync, readdirSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// detect APK in app/android folder
function getAPK() {
    if (process.env.PLATFORM !== 'android') return null;

    const appDir = path.resolve(process.cwd(), 'app/android');

    if (!existsSync(appDir)) return null;

    const files = readdirSync(appDir)
        .filter(f => f.endsWith('.apk'))
        .sort()
        .reverse();

    return files.length ? path.join(appDir, files[0]) : null;
}

// detect if app already installed on device
function isAppInstalled(packageId, udid) {
    try {
        const result = execSync(
            `adb -s ${udid} shell pm list packages ${packageId}`,
            { encoding: 'utf8' }
        );
        return result.includes(packageId);
    } catch {
        return false;
    }
}

// REQUIRED — DO NOT REMOVE
const isWeb = process.env.MOBILE_WEB === 'true';

const apkPath = getAPK();
const packageId = 'yesmadamservices.app.com.yesmadamservices';
const mainActivity = 'yesmadam.app.com.yesmadamservices.module.user.SplashActivity';

export default new BaseConfig({
    local: {
        name: 'Android Local',

        // Web vs Native logic
        capabilities: isWeb
            ? {
                platformName: 'Android',
                browserName: 'Chrome',
                'appium:automationName': 'UiAutomator2'
            }
            : (device => {
                const installed = isAppInstalled(packageId, device.udid);

                console.log(
                    installed
                        ? `\x1b[32mApp already installed on ${device.udid} — launching via appPackage\x1b[0m`
                        : `\x1b[33mApp not installed on ${device.udid} — installing APK\x1b[0m`
                );

                return installed
                    ? {
                        platformName: 'Android',
                        'appium:automationName': 'UiAutomator2',
                        'appium:appPackage': packageId,
                        'appium:appActivity': mainActivity,
                        'appium:noReset': true,
                        'appium:autoGrantPermissions': true
                    }
                    : {
                        platformName: 'Android',
                        'appium:automationName': 'UiAutomator2',
                        'appium:app': apkPath,
                        'appium:autoGrantPermissions': true
                    };
            })
    }
});

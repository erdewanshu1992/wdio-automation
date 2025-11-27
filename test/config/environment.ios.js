import BaseConfig from './base.config.js';
import { existsSync, readdirSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Find latest IPA/ZIP
function getIPA() {
    const appDir = path.resolve(process.cwd(), 'app/iOS');

    if (!existsSync(appDir)) {
        console.warn(`iOS app folder not found at: ${appDir}`);
        return null;
    }

    const files = readdirSync(appDir)
        .filter(f => f.endsWith('.ipa') || f.endsWith('.zip'))
        .sort()
        .reverse();

    return files.length ? path.join(appDir, files[0]) : null;
}

// Check if installed
function isAppInstalled(bundleId, udid) {
    try {
        execSync(
            `xcrun simctl get_app_container ${udid} ${bundleId}`,
            { encoding: 'utf8' }
        );
        return true;
    } catch {
        return false;
    }
}

const isWeb = process.env.MOBILE_WEB === 'true';

const bundleId = 'com.saucelabs.SwagLabsMobileApp'; // Replace with your app's bundle ID
const ipaPath = getIPA();

export default new BaseConfig({
    local: {
        name: 'iOS Local',

        capabilities: device => {
            if (isWeb) {
                return {
                    platformName: 'iOS',
                    browserName: 'Safari',
                    'appium:automationName': 'XCUITest'
                };
            }

            const installed = isAppInstalled(bundleId, device.udid);

            console.log(
                installed
                    ? `\x1b[32mApp already installed on ${device.name} — launching via bundleId\x1b[0m`
                    : `\x1b[33mInstalling app on ${device.name} from IPA\x1b[0m`
            );

            return installed
                ? {
                    platformName: 'iOS',
                    'appium:automationName': 'XCUITest',
                    'appium:bundleId': bundleId,
                    'appium:noReset': true
                }
                : {
                    platformName: 'iOS',
                    'appium:automationName': 'XCUITest',
                    'appium:app': ipaPath,
                    'appium:noReset': true,
                    'appium:autoAcceptAlerts': true
                };
        }
    }
});

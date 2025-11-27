describe('New Tab Handling in WebdriverIO', () => {
  it('should open a new tab and switch between tabs', async () => {
    // Step 1: Open main page
    await browser.url('https://google.com');
    console.log('Opened Google');

    // Step 2: Store current window handle
    const parentHandle = await browser.getWindowHandle();

    // Step 3: Open new tab using newWindow()
    await browser.newWindow('https://webdriver.io');
    console.log('Opened WebdriverIO in new tab');

    // Step 4: Verify current URL
    const currentUrl = await browser.getUrl();
    console.log('Current URL:', currentUrl);

    // Step 5: Do something in new tab
    const title = await browser.getTitle();
    console.log('New Tab Title:', title);

    // Step 6: Switch back to original tab
    await browser.switchToWindow(parentHandle);
    console.log('Switched back to Google');

    // Step 7: Verify current tab title
    const oldTabTitle = await browser.getTitle();
    console.log('Old Tab Title:', oldTabTitle);
  });
});

describe('Simulate New Tab Handling on Android Chrome', () => {
  it('should simulate opening a new tab by navigating and going back', async () => {
    // Step 1: Open main page
    await browser.url('https://google.com');
    console.log('Opened Google on Android Chrome');

    // Step 2: Get the title
    const parentTitle = await browser.getTitle();
    console.log('Original Page Title:', parentTitle);

    // Step 3: Navigate to another URL (simulate new tab)
    await browser.url('https://webdriver.io');
    console.log('Navigated to WebdriverIO (simulated new tab)');

    // Step 4: Verify current URL and title
    const newUrl = await browser.getUrl();
    const newTitle = await browser.getTitle();
    console.log('Current URL:', newUrl);
    console.log('New Page Title:', newTitle);

    // Step 5: Go back to Google (simulate switching back)
    await browser.back();
    console.log('Navigated back to Google');

    // Step 6: Verify we are back
    const backUrl = await browser.getUrl();
    const backTitle = await browser.getTitle();
    console.log('Back URL:', backUrl);
    console.log('Back Title:', backTitle);
  });
});

// npx cross-env PLATFORM=android wdio run wdio.conf.enhanced.js --spec ./test/specs/android-mobile-web/open-new-tab.test.spec.js

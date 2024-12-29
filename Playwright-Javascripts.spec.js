import { test, expect } from '@playwright/test';

test.describe ('VXG Web Client', () => {

const url = 'http://cloudtwo.cloud-vms.com/customer/alerts';
const customerEmail = 'dev@testing.com';
const customerPassword = '123456';

  test.beforeEach('Login Page', async({page}) => {
    //Navigate to the Login Page
    await page.goto(url);
    
    // Perform basic interactions like filling out customers and clicking a button.
    await page.getByRole('textbox', { name: 'Email' }).first().click();
    await page.fill('input[placeholder="Email"]',customerEmail);
    await page.fill('input[placeholder="Password"]',customerPassword);
    await page.getByRole('button', {name:'Sign In'}).first().click();
    await page.locator('//a[@href="/customer/alerts"]').first().click();
  });

  test('Verify that all elements on the page', async ({ page }) => {
    // Verify elements are visible on the Alerts page
    await expect(page.locator('Alerts')).toBeVisible;
    await expect(page.locator('//a[@href="/customer/alerts"]')).toHaveText('Alerts');
    // Verify elements are visible on the Site dropdown list
    await expect(page.locator('button[role="combobox"]').nth(0)).toHaveText('Site');
  });

  test('Validate the expected outcomes', async ({ page }) => {
    //Validate the expected outcomes after filtered items on Site dropbox 
    const stateDataRows = page.locator('.data-state');
    
    await page.locator('button[role="combobox"]').nth(0).first().click();
    await expect(page.locator('//*[@id=":re:"]')).toHaveText('Office');
    await expect(page.locator('//*[@id=":rf:"]')).toHaveText('Toronto');
    await expect(page.locator('//*[@id=":rg:"]')).toHaveText('All');
    await page.locator('//*[@id=":re:"]').first().click({ timeout: 30000 });
    await expect(page.locator('button[role="combobox"]').nth(0)).toHaveText('Office');
      
    const filteredData = await stateDataRows.allTextContents();
    
    filteredData.forEach(data => {
        expect(data).toContain('Expected Value');
    });
  });
});
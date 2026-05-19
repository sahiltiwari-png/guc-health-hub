const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message, error.stack));

  console.log('Navigating to http://localhost:8080/login');
  await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle2' });
  
  // We need to bypass login to see the pages!
  await page.evaluate(() => {
    localStorage.setItem('hms_user', JSON.stringify({ name: 'Admin', role: 'SUPER_ADMIN' }));
    localStorage.setItem('hms_token', 'dummy-token');
  });

  console.log('Navigating to death-postmortem...');
  await page.goto('http://localhost:8080/death-postmortem', { waitUntil: 'networkidle2' });
  
  console.log('Navigating to bed-management...');
  await page.goto('http://localhost:8080/bed-management', { waitUntil: 'networkidle2' });

  await browser.close();
})();

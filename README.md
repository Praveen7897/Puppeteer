//Do's and Dont's while scrapping
In case of provided API, try to avoid Web Scraping
Keep an interval of around 12-15 seconds in between your requests
Don’t use the scraped data for commercial purposes without the consent of the original owner.
Always go through the Terms of Service and follow the policies.
If someone has put some restrictions to access their data, it will be good to ask for permission from them before going further.

//To Check if the website allows scrapping
Robots.txt file: This will say which pages can you access with a scraper.
Terms & Conditions: Their T&Cs will normally say if they permit scraping, programmatic access, etc.
Presence of Anti-Bot Protection: If you are getting ban pages from Cloudflare, Distill Network, Imperva, DataDome, etc. then it is highly likely that the website doesn't want you to scrape them.

//If Scrapping is Blocked use the below methods for Scrapping
User-Agents & Headers: You need to use fake user-agents when scraping as most HTTP clients clearly identify themselves by default, giving you away as a scraper. Better yet you should use full fake browser headers that match what a real browser should send to a website. 
Rotating Proxies: You should send your requests via a rotating proxy pool that will make it harder for the website to detect you as a scraper. Residential & Mobile proxies are better than datacenter proxies but are a lot more expensive. 
Fortified Headless Browser: Depending on the anti-bot protection the website is using you may need to use a fortified headless browser that can solve its JS challenges without giving its identity away. Your options include the Puppeteer stealth plugin and Selenium undetected-chromedriver.# Puppeteer

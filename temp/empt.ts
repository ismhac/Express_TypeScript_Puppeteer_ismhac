
async crawlProduct(shopLink: string, categoryOfShopId: string){
    const browser: Browser = await puppeteer.launch({
        headless: false,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        args: ['--start-maximized'],
    });
    const page = (await browser.pages())[0]
}
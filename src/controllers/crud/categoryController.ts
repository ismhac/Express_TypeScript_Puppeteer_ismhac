import { categoryService } from "@/services";
import { CrudController } from "../crudController";
const schedule = require("node-schedule");
import puppeteer, { Browser, Page } from "puppeteer"


export class CategoryController extends CrudController<typeof categoryService>{
    constructor() {
        super(categoryService)
        schedule.scheduleJob('0 0 */1 */1 *', async () => {//sync data everyday
            this.syncData()
        });
    }

    async syncData() {
        const url = "https://shopee.vn/"
        let browser = await this.startBrowser()
        let result = this.scrapeCategory(browser, url)

        console.log(result);
    }

    // async crawlData() {
    //     const url = "https://shopee.vn/"
    //     let browser = await this.startBrowser

    // }

    async startBrowser() {
        let browser: Browser
        try {
            browser = await puppeteer.launch({
                // headless: true, // false: display ui - true: hide ui
                headless: "new",
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true
            })
        } catch (error) {
            console.log("Unable to create browser: ", error);
        }
        return browser
    }

    scrapeCategory = (browser: Browser, url: string) => new Promise(async (resolve, reject) => {
        try {
            let newPage: Page = await browser.newPage()
            console.log("A new tab has been opened...");
            await newPage.goto(url)
            console.log("Accessed the link: ", url);
            newPage.waitForSelector("#main")
            console.log("Website has finished loading...");

            // Start scrapping 
            let result = await newPage.evaluate(() => Array.from(document.querySelectorAll("div.shopee-header-section__content > div.image-carousel > div.image-carousel__item-list-wrapper > ul.image-carousel__item-list > li.image-carousel__item")).map(el => ({
                title: el.querySelector("a.home-category-list__category-grid > div.b7TOTn > div.SVrSgR > div.K34m1x").textContent,
                category_link: el.querySelector("a").href,
                image: el.querySelector("a.home-category-list__category-grid > div.b7TOTn > div.x51L1w > div > div").getAttribute("style")
            }))
            )

            newPage.close()

        } catch (error) {
            reject(`Error occurred in scrapeCategory: ${error}`)
        }
    })
} 
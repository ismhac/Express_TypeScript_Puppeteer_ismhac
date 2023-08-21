import { categoryService, categoryShopService, shopService } from "@/services";
import { CrudController } from "../crudController";
import {
    ICategory,
    IShop,
    ICategoryShop,
    ICategory_of_Shop,
    IProduct
} from "../../interfaces"
const schedule = require("node-schedule");
import puppeteer, { Browser, Page } from "puppeteer"
import axios from "axios";
import { resolve } from "path";
import { reject } from "lodash";
import { sequelize } from "@/models";



export class CategoryController extends CrudController<typeof categoryService>{
    constructor() {
        super(categoryService)
        // schedule.scheduleJob('0 0 */1 */1 *', async () => {
        //     this.syncData()
        // });
    }

    async syncData() {
        const transaction = await sequelize.transaction();
        const browser: Browser = await this.startBrowser();
        const cookie = await this.getCookies(browser);

        let headers: {} = {
            "User-Agent": process.env.USER_AGENT || "",
            Cookie: cookie,
        }

        // Crawl Main Category
        const categoryCrawUrl: string = `https://shopee.vn/api/v4/pages/get_category_tree`
        const response = await axios.get(categoryCrawUrl, { headers });
        const categoryCrawJson = JSON.parse(JSON.stringify(response.data)); // data main category
        const categories: ICategory[] = categoryCrawJson.data.category_list.map((element: any) => ({
            id: element.catid,
            title: element.display_name,
            category_link: `https://shopee.vn/${element.display_name.toLowerCase().replace(/[& ]+/g, '-')}-cat.${element.catid}`,
            image: `https://down-vn.img.susercontent.com/file/${element.image}`
        }));

        // Crawl Shop
        if (categories.length > 0) {
            for (const category of categories) {
                const categoryItem: any = await this.service.findOrCreate(category, { transaction })
                const shopCrawUrl = `https://shopee.vn/api/v4/official_shop/get_shops_by_category?need_zhuyin=0&category_id=${category.id}`;
                const response = await axios.get(shopCrawUrl, { headers });
                const shopCrawJson = response.data;
                const shops: IShop[] = shopCrawJson.data.brands.flatMap((brandGroup: any) =>
                    brandGroup.brand_ids.map((el: any) => ({
                        id: el.shopid,
                        name: el.brand_name,
                        shop_link: `https://shopee.vn/${el.username}`,
                        logo: `https://down-vn.img.susercontent.com/file/${el.logo}`
                    }))
                );

                if (shops.length > 0) {
                    for (const shop of shops) {
                        const shopItem: any = await shopService.findOrCreate(shop, { transaction })
                        const categoryShop: ICategoryShop = {
                            category_id: category.id,
                            shop_id: shop.id
                        }
                        const categoryShopItem: any = await categoryShopService.findOrCreate(categoryShop, { transaction })
                    }
                }
            }
            await transaction.commit();
        }
    }

    async getCookies(browser: Browser) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const page: Page = await browser.newPage();
                await page.setViewport({ width: 1535, height: 700 });
                await page.goto('https://shopee.vn/buyer/login');   // Go to Login Page

                await page.waitForSelector('input[name="loginKey"]', {
                    timeout: 3000,
                    visible: true
                });
                await page.waitForSelector('input[name="password"]', {
                    timeout: 3000,
                    visible: true
                });

                await page.type('input[name="loginKey"]', '0399985860');    // Input username
                await page.waitForTimeout(1000);
                await page.type('input[name="password"]', 'Captainhac');    // Input password
                await page.waitForTimeout(2000);
                await page.click('.wyhvVD._1EApiB.hq6WM5.L-VL8Q.cepDQ1._7w24N1'); // Click to login button

                await page.waitForNavigation();

                const currentCookies = await page.cookies();
                const standardizedCookie = currentCookies.map(
                    (cookie: { name: any; value: any }) => `${cookie.name}=${cookie.value}`).join("; ");

                resolve(standardizedCookie)
            } catch (error) {
                reject(`get cookie fail: ${error}`)
            }
        })
    }

    async startBrowser() {
        return new Promise<Browser>(async (resolve, reject) => {
            try {
                const browser: Browser = await puppeteer.launch({
                    headless: false,
                    args: ["--disable-setuid-sandbox"],
                    'ignoreHTTPSErrors': true
                });
                resolve(browser)
            } catch (error) {
                reject(`Start browser fail: ${error}`)
            }
        })
    }
} 
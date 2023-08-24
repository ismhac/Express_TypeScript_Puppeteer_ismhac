import { categoryOfShopService, categoryService, categoryShopService, productService, shopService } from "@/services";
import { CrudController } from "../crudController";
import {
    ICategory, IShop, ICategoryShop, ICategory_of_Shop, IProduct,
    ICategoryCraw,
    ICategory_of_Shop_Craw,
    IShopCraw
} from "@/interfaces"

import axios from "axios";
import { sequelize } from "@/models";
const fs = require("fs")

// Puppeteer 
const randomUseragent = require('random-useragent');
const puppeteer = require('puppeteer-extra');
import { Browser, Page } from "puppeteer"
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());

export class CategoryController extends CrudController<typeof categoryService>{
    constructor() {
        super(categoryService)
    }

    async crawlMainCategories(headers: any): Promise<ICategoryCraw[]> {
        try {
            const categoryCrawUrl: string = `https://shopee.vn/api/v4/pages/get_category_tree`;
            const response = await axios.get(categoryCrawUrl, { headers });
            const categoryCrawJson = JSON.parse(JSON.stringify(response.data));

            const categories: ICategoryCraw[] = categoryCrawJson.data.category_list.map((element: any) => ({
                id: element.catid,
                title: element.display_name,
                category_link: `https://shopee.vn/${element.display_name.toLowerCase().replace(/[& ]+/g, '-')}-cat.${element.catid}`,
                image: `https://down-vn.img.susercontent.com/file/${element.image}`
            }));

            return categories;
        } catch (error) {
            console.log(error);
        }
    }

    async crawlShops(category: ICategoryCraw, headers: any): Promise<IShop[]> {
        try {
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

            return shops;
        } catch (error) {
            console.log(error);
        }
    }

    extractLastInt(s: string): number {
        const match = s.match(/\d+$/);
        return match ? parseInt(match[0]) : Math.floor(Math.random() * 1000000000) + 100000000;
    }

    async crawlCategoriesOfShop(url: string, shopId: number): Promise<ICategory_of_Shop_Craw[]> {
        const browser: Browser = await puppeteer.launch({
            headless: false,
            executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
            args: ['--start-maximized'],
        });
        const page = (await browser.pages())[0]

        try {
            await page.goto(url);
            await page.waitForTimeout(5000);

            const categoryElements = await page.$$("#main > div > div:nth-child(3) > div > div > div > div.shop-page > div > div.container > div.shop-page__all-products-section > div._1Jkvaf > div:nth-child(2) .zvVwjQ");

            let categoriesOfShopList: ICategory_of_Shop_Craw[] = []

            for (let i = 1; i < categoryElements.length; i++) {
                await categoryElements[i].click()
                await page.waitForTimeout(5000);
                const currentUrl = page.url()
                let id = this.extractLastInt(currentUrl)
                let title = await categoryElements[i].evaluate(el => el.textContent?.trim())

                const categoriesOfShop: ICategory_of_Shop_Craw = {
                    id: id,
                    shop_id: shopId,
                    title: title,
                    link: currentUrl,
                }
                categoriesOfShopList.push(categoriesOfShop);
            }
            return categoriesOfShopList;
        } catch (error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    }

    async crawlProduct(shopLink: string, categoryOfShopId: number) {
        const browser: Browser = await puppeteer.launch({
            headless: false,
            executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
            args: ['--start-maximized'],
        });

        try {
            let products: IProduct[] = []

            for (let i = 0; i < 2; i++) {
                const url = `${shopLink}?page=${i}&shopCollection=${categoryOfShopId}`
                const page = (await browser.pages())[0]
                await page.goto(url)
                await page.waitForTimeout(10000);
                const productElements = await page.$$(".shop-search-result-view__item.col-xs-2-4")
                if (productElements.length < 1) {
                    continue
                } else {
                    for (const item of productElements) {
                        const link = (await ((await (await item.$("a[data-sqe='link']"))?.getProperty("href"))?.jsonValue())).trim()
                        const name = (await ((await (await item.$(".h0HBrE.ckHqor._5Kkvx1"))?.getProperty("textContent"))?.jsonValue())).trim()
                        const price = await ((await (await (await item.$("._0ZJOIv"))?.getProperty("textContent"))?.jsonValue()).trim())
                        let image = await ((await (await item.$(".vYyqCY.yg8VCe"))?.getProperty("src"))?.jsonValue()) as string

                        if (image === undefined) {
                            image = "No Image"
                        }

                        const product: IProduct = {
                            categories_of_shop_id: categoryOfShopId,
                            name: name,
                            price: parseInt(price),
                            product_link: link,
                            images: image
                        }
                        products.push(product)
                    }
                }
            }
            return products
        } catch (error) {
            console.log(error);
        } finally {
            browser.close()
        }
    }

    async syncData() {
        const transaction = await sequelize.transaction();
        const browser: Browser = await this.startBrowser();
        const cookie = await this.getCookies(browser);

        let headers: {} = {
            "User-Agent": randomUseragent.getRandom([
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
                'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36'
            ]),
            Cookie: cookie,
        }

        // Crawl Main Category
        const categories = await this.crawlMainCategories(headers)
        if (categories && categories.length > 0) {
            for (const category of categories) {
                const bodyCategory: ICategory = await this.convertDataCrawledToPrimaryCategory(category)
                const categoryItem: any = await this.service.findOrCreate(bodyCategory, { transaction }) // save to db

                // Crawl Shop
                const shops = await this.crawlShops(category, headers)
                if (shops && shops.length > 0) {
                    category.shops = shops
                    for (const shop of shops) {
                        const bodyShop: IShop = await this.convertDataCrawledToPrimaryShop(shop)
                        const shopItem: any = await shopService.findOrCreate(bodyShop, { transaction }) // save to db

                        // category - shop (relation)
                        const bodyCategoryShop: ICategoryShop = {
                            shop_id: shop.id,
                            category_id: category.id
                        }
                        const categoryShopItem: any = await categoryShopService.findOrCreate(bodyCategoryShop, { transaction }) // save to db
                    }
                }
            }
            await browser.close()
        }

        for (const category of categories) {
            if (category && category.shops && category.shops.length > 0 && category.shops[1].shop_link) {
                const url = category.shops[0].shop_link;
                const shopId = category.shops[0].id;

                // Crawl Categories Of Shop
                const categoriesOfShopList = await this.crawlCategoriesOfShop(url, shopId);
                if (categoriesOfShopList && categoriesOfShopList.length > 0) {
                    for (const categoriesOfShop of categoriesOfShopList) {
                        const bodyCategoriesOfShop: ICategory_of_Shop = await this.convertDataCrawledToPrimaryCategoriesOfShop(categoriesOfShop)
                        const categoriesOfShopItem: any = await categoryOfShopService.findOrCreate(bodyCategoriesOfShop, { transaction }) // save to db

                        const products = await this.crawlProduct(url, categoriesOfShop.id)
                        // console.log(">>> check product list: ", products);
                        if (products && products.length > 0) {
                            for (const bodyProduct of products) {
                                const productItem: any = await productService.findOrCreate(bodyProduct, { transaction }) // save to db
                            }
                        }
                    }
                }
                // console.log(">>> check categories of shop crawl: ", categoriesOfShopList);
            } else {
                continue;
            }
        }
        await transaction.commit();
    }

    async getCookies(browser: Browser) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const page = (await browser.pages())[0]
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
                    // args: ["--disable-setuid-sandbox"],
                    args: ['--start-maximized'],
                    'ignoreHTTPSErrors': true
                });
                resolve(browser)
            } catch (error) {
                reject(`Start browser fail: ${error}`)
            }
        })
    }

    convertDataCrawledToPrimaryCategory(body: ICategoryCraw) {
        const bodyCategory: ICategory = {
            id: body.id,
            title: body.title,
            link: body.link,
            image: body.image
        }
        return bodyCategory
    }

    convertDataCrawledToPrimaryShop(body: IShopCraw) {
        const bodyShop: IShop = {
            id: body.id,
            name: body.name,
            shop_link: body.shop_link,
            logo: body.logo
        }
        return bodyShop
    }

    convertDataCrawledToPrimaryCategoriesOfShop(body: ICategory_of_Shop_Craw) {
        const bodyCategoriesOfShop: ICategory_of_Shop = {
            id: body.id,
            shop_id: body.shop_id,
            title: body.title,
            link: body.link
        }
        return bodyCategoriesOfShop
    }
} 
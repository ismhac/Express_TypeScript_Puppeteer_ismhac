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

    // get categories of a shop
    async getResultAllCategoryByShopId(params: { shop_id: Number }) {
        try {
            const result = await this.service.getResultAllCategoryByShopId(params)
            return result
        } catch (error) {
            console.log(">>> Error in CategoryController -> getResultAllCategoryByShopId: ", error);
        }
    }

    async crawlMainCategories(): Promise<ICategoryCraw[]> {
        console.log("=== Crawl main category ===");
        try {
            const categoryCrawUrl: string = `https://shopee.vn/api/v4/pages/get_category_tree`;
            const response = await axios.get(categoryCrawUrl);
            const categoryCrawJson = JSON.parse(JSON.stringify(response.data));

            const categories: ICategoryCraw[] = categoryCrawJson.data.category_list.map((element: any) => ({
                id: element.catid,
                title: element.display_name,
                category_link: `https://shopee.vn/${element.display_name.toLowerCase().replace(/[& ]+/g, '-')}-cat.${element.catid}`,
                image: `https://down-vn.img.susercontent.com/file/${element.image}`
            }));

            return categories;
        } catch (error) {
            console.log(`Error in #crawlMainCategories:\n###[${error}]###`);
        }
    }

    async crawlShops(category: ICategoryCraw): Promise<IShop[]> {
        console.log("=== Crawl shops ===");
        try {
            const shopCrawUrl = `https://shopee.vn/api/v4/official_shop/get_shops_by_category?need_zhuyin=0&category_id=${category.id}`;
            const response = await axios.get(shopCrawUrl);
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
            console.log(`Error in #crawlShops:\n###[${error}]###`);
        }
    }

    extractLastInt(s: string): number {
        const match = s.match(/\d+$/);
        return match ? parseInt(match[0]) : Math.floor(Math.random() * 1000000000) + 100000000;
    }

    async crawlCategoriesOfShop(browser: Browser, url: string, shopId: number): Promise<ICategory_of_Shop_Craw[]> {
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
            console.log(`Error in #crawlCategoriesOfShop:\n ###[${error}]###`);
        }
    }

    async crawlProduct(browser: Browser, shopLink: string, categoryOfShopId: number) {
        const page = (await browser.pages())[0]

        try {
            let products: IProduct[] = []
            for (let i = 0; i < 2; i++) {
                const url = `${shopLink}?page=${i}&shopCollection=${categoryOfShopId}`
                await page.goto(url)
                await page.waitForTimeout(10000);
                const productElements = await page.$$(".shop-search-result-view .shop-search-result-view__item.col-xs-2-4")
                if (productElements.length < 1) { // Not found any element contain product
                    continue
                } else { // Found a list of elements containing products
                    for (const item of productElements) {
                        const link = (await ((await (await item.$("a[data-sqe='link']"))?.getProperty("href"))?.jsonValue())).trim()
                        const name = (await ((await (await item.$(".h0HBrE.ckHqor._5Kkvx1"))?.getProperty("textContent"))?.jsonValue())).trim()
                        const price = await ((await (await (await item.$("._0ZJOIv"))?.getProperty("textContent"))?.jsonValue()).trim())
                        let image = await ((await (await item.$(".vYyqCY"))?.getProperty("src"))?.jsonValue()) as string

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
            console.log(`Error in #crawlProduct:\n ###[${error}]###`);
        }
    }

    async syncData() {
        try {
            const transaction = await sequelize.transaction();

            const browser: Browser = await puppeteer.launch({
                headless: false,
                executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
                args: ['--start-maximized'],
            });

            const categories = await this.crawlMainCategories()

            console.log(">>> check main category list:\n", categories);

            if (categories && categories.length > 0) {
                for (const category of categories) {
                    const bodyCategory: ICategory = await this.convertDataCrawledToPrimaryCategory(category)
                    const categoryItem: any = await this.service.findOrCreate(bodyCategory, { transaction }) // save to db

                    // Crawl Shop
                    const shops = await this.crawlShops(category)
                    console.log(">>> check shop list:\n", shops);
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
            }

            for (const category of categories) {
                if (category && category.shops && category.shops.length > 0 && category.shops[0].shop_link) {
                    const url = category.shops[0].shop_link;
                    const shopId = category.shops[0].id;

                    // Crawl Categories Of Shop
                    const categoriesOfShopList = await this.crawlCategoriesOfShop(browser, url, shopId);
                    console.log(">>> check categories of shop list:\n", categoriesOfShopList);

                    if (categoriesOfShopList && categoriesOfShopList.length > 0) {
                        for (const categoriesOfShop of categoriesOfShopList) {
                            const bodyCategoriesOfShop: ICategory_of_Shop = await this.convertDataCrawledToPrimaryCategoriesOfShop(categoriesOfShop)
                            const categoriesOfShopItem: any = await categoryOfShopService.findOrCreate(bodyCategoriesOfShop, { transaction }) // save to db

                            const products = await this.crawlProduct(browser, url, categoriesOfShop.id)
                            console.log(">>> check product list:\n", products);

                            if (products && products.length > 0) {
                                for (const bodyProduct of products) {
                                    const productItem: any = await productService.findOrCreate(bodyProduct, { transaction }) // save to db
                                }
                            } else {
                                console.log("Not found product list!");
                            }
                        }
                    }
                    else {
                        console.log("Not found categories of shop list!");
                    }
                } else {
                    console.log("Not found category!");
                }
            }

            await transaction.commit();
            await browser.close();
        } catch (error) {
            console.log(`Sync data from Shopee failed! Error:\n ###[${error}]###`);
        } finally {
            console.log("Completed sync data from Shopee ^_^ !");
        }
    }

    async startBrowser(): Promise<Browser> {
        try {
            const browser: Browser = await puppeteer.launch({
                headless: false,
                executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
                args: ['--start-maximized'],
            });
            return browser
        } catch (error) {
            console.log(`Start browser fail: ${error}`)
        }
    }

    //
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
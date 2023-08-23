// import { categoryOfShopService, categoryService, categoryShopService, shopService } from "@/services";
// import { CrudController } from "../crudController";
// import {
//     ICategory, IShop, ICategoryShop, ICategory_of_Shop, IProduct,
//     ICategoryCraw
// } from "@/interfaces"
// import puppeteer, { Browser, Page } from "puppeteer"
// import axios from "axios";
// import { sequelize } from "@/models";
// const fs = require("fs")
// const randomUseragent = require('random-useragent');
// const puppeteerExtra = require('puppeteer-extra');
// const Stealth = require('puppeteer-extra-plugin-stealth');
// puppeteerExtra.use(Stealth());


// export class CategoryController extends CrudController<typeof categoryService>{
//     constructor() {
//         super(categoryService)
//     }

//     async crawlMainCategories(headers: any): Promise<ICategoryCraw[]> {
//         try {
//             const categoryCrawUrl: string = `https://shopee.vn/api/v4/pages/get_category_tree`;
//             const response = await axios.get(categoryCrawUrl, { headers });
//             const categoryCrawJson = JSON.parse(JSON.stringify(response.data));

//             const categories: ICategoryCraw[] = categoryCrawJson.data.category_list.map((element: any) => ({
//                 id: element.catid,
//                 title: element.display_name,
//                 category_link: `https://shopee.vn/${element.display_name.toLowerCase().replace(/[& ]+/g, '-')}-cat.${element.catid}`,
//                 image: `https://down-vn.img.susercontent.com/file/${element.image}`
//             }));

//             return categories;
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     async crawlShops(category: ICategoryCraw, headers: any): Promise<IShop[]> {
//         try {
//             const shopCrawUrl = `https://shopee.vn/api/v4/official_shop/get_shops_by_category?need_zhuyin=0&category_id=${category.id}`;
//             const response = await axios.get(shopCrawUrl, { headers });
//             const shopCrawJson = response.data;
//             const shops: IShop[] = shopCrawJson.data.brands.flatMap((brandGroup: any) =>
//                 brandGroup.brand_ids.map((el: any) => ({
//                     id: el.shopid,
//                     name: el.brand_name,
//                     shop_link: `https://shopee.vn/${el.username}`,
//                     logo: `https://down-vn.img.susercontent.com/file/${el.logo}`
//                 }))
//             );

//             return shops;
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     async crawlCategoriesOfShop(browser: Browser, headers: any, url: string) {

//         const newPage: Page = await browser.newPage();
//         await newPage.setExtraHTTPHeaders(headers)
//         await newPage.goto(url, { timeout: 60000 });

//         const divTags = await newPage.$$(".zvVwjQ");
//         if (divTags && divTags.length > 0) {
//             for (const item of divTags) {
//                 const title = await item.evaluate(el => el.textContent.trim())
//                 console.log(title);
//             }
//         }

//         await newPage.close()

//         //     for (const categoryElement of divTags) {
//         //         const categoryName = await categoryElement.evaluate((element) =>
//         //             element.textContent?.trim()
//         //         );
//         //         console.log(categoryName);

//         //         if (categoryName !== "Sản Phẩm") {
//         //             await categoryElement.click();
//         //             await page.waitForNavigation();
//         //             await page.waitForFunction(() => document.readyState === 'complete');

//         //             const currentUrl = await page.url();

//         //             const match = currentUrl.match(/(\d+)$/);

//         //             if (match) {
//         //                 const numberString = match[1]; // Lấy dãy số từ match
//         //                 const shopCollectionId = parseInt(numberString); // Chuyển đổi thành số nguyên
//         //                 console.log("Shop Collection ID:", shopCollectionId);
//         //             } else {
//         //                 console.log("Không tìm thấy dãy số ở cuối URL");
//         //             }
//         //             await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 9001) + 1000));
//         //             await page.goBack();
//         //             await page.waitForNavigation();
//         //         }
//         //     }
//         // await page.close()
//     }

//     async syncData() {
//         const transaction = await sequelize.transaction();
//         const browser: Browser = await this.startBrowser();
//         const cookie = await this.getCookies(browser);

//         let headers: {} = {
//             "User-Agent": randomUseragent.getRandom([
//                 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
//                 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.203'
//             ]),
//             Cookie: cookie,
//         }

//         // Crawl Main Category
//         const categories = await this.crawlMainCategories(headers)
//         if (categories && categories.length > 0) {
//             for (const category of categories) {
//                 const shops = await this.crawlShops(category, headers)
//                 if (shops && shops.length > 0) {
//                     category.shops = shops
//                 }
//             }
//         }

//         for (const category of categories) {
//             const url = category.shops[0].shop_link
//             const categoriesOfShopList = await this.crawlCategoriesOfShop(browser, headers, url)
//         }

//         console.log(categories);

//         // fs.writeFile('data.json', JSON.stringify(categories), (err: any) => {
//         //     if (err) console.log("write data fail");
//         //     console.log("write data successfully");
//         // })

//         // await browser.close()

//         // await transaction.commit();
//     }

//     async getCookies(browser: Browser) {
//         return new Promise<string>(async (resolve, reject) => {
//             try {
//                 const page: Page = await browser.newPage();
//                 await page.setViewport({ width: 1535, height: 700 });
//                 await page.goto('https://shopee.vn/buyer/login');   // Go to Login Page

//                 await page.waitForSelector('input[name="loginKey"]', {
//                     timeout: 3000,
//                     visible: true
//                 });
//                 await page.waitForSelector('input[name="password"]', {
//                     timeout: 3000,
//                     visible: true
//                 });

//                 await page.type('input[name="loginKey"]', '0399985860');    // Input username
//                 await page.waitForTimeout(1000);
//                 await page.type('input[name="password"]', 'Captainhac');    // Input password
//                 await page.waitForTimeout(2000);
//                 await page.click('.wyhvVD._1EApiB.hq6WM5.L-VL8Q.cepDQ1._7w24N1'); // Click to login button

//                 await page.waitForNavigation();

//                 const currentCookies = await page.cookies();
//                 const standardizedCookie = currentCookies.map(
//                     (cookie: { name: any; value: any }) => `${cookie.name}=${cookie.value}`).join("; ");

//                 resolve(standardizedCookie)
//             } catch (error) {
//                 reject(`get cookie fail: ${error}`)
//             }
//         })
//     }

//     async startBrowser() {
//         return new Promise<Browser>(async (resolve, reject) => {
//             try {
//                 const browser: Browser = await puppeteer.launch({
//                     headless: false,
//                     args: ["--disable-setuid-sandbox"],
//                     'ignoreHTTPSErrors': true
//                 });
//                 resolve(browser)
//             } catch (error) {
//                 reject(`Start browser fail: ${error}`)
//             }
//         })
//     }
// } 
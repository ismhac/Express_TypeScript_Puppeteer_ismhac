import { ICategory_of_Shop } from "./category_of_shop.interface"

export interface IShopCraw {
    id?: number
    name: string
    shop_link: string
    logo: string
    categories_of_shop?: Array<ICategory_of_Shop>
}

export interface IShop {
    id?: number
    name: string
    shop_link: string
    logo: string
}
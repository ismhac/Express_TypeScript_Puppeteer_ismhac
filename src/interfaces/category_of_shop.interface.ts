import { IProduct } from "./product.interface"

export interface ICategory_of_Shop_Craw {
    id?: number
    shop_id: number
    title: string
    link: string
    products?: Array<IProduct>
}

export interface ICategory_of_Shop {
    id?: number
    shop_id: number
    title: string
    link: string
}
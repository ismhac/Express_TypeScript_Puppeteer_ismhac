import { json } from "sequelize"

export interface IProduct {
    id?: string
    categories_of_shop_id: string
    name: string
    price: number
    product_link: string
    images: string
}
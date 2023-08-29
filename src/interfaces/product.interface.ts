import { UUID } from "crypto"
import { json } from "sequelize"

export interface IProduct {
    id?: UUID
    categories_of_shop_id: number
    name: string
    price: number
    product_link: string
    images: string
}
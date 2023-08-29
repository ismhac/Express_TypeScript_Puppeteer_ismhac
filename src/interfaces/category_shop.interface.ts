import { UUID } from "crypto"

export interface ICategoryShop {
    id?: UUID
    shop_id: number
    category_id: number
}
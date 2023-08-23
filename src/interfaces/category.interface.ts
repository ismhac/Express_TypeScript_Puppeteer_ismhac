import { IShop } from "./shop.interface";

export interface ICategoryCraw {
    id?: number,
    title: string,
    link: string,
    image: string,
    shops?: Array<IShop>,
}

export interface ICategory {
    id?: number,
    title: string,
    link: string,
    image: string,
}



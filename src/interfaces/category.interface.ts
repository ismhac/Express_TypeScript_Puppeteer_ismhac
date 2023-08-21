import { json } from "sequelize";

// export interface ICategoryCraw {
//     title: string,
//     link: string,
//     image: string,
//     shops?: Array<ICategoryShop>,
// }

export interface ICategory {
    id?: number,
    title: string,
    link: string,
    image: string,
}



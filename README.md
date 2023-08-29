# nodejs-express-craw-f1

Here is the server craw data from the shopee.vn site including:

1. All data of main categories: working and not work (28 record).
2. All data of shops: working and not work (3137 record).
3. All data of categories of shops (235 record).
4. All data of products (6064 record).

###### recomend using: Nodejs v20.5.1, TypeScript v5.1.6

# How to run server from local

1. Check node version(20.5.1) and TypeScript [https://www.npmjs.com/package/typescript/v/5.1.6](https://www.npmjs.com/package/typescript/v/5.1.6)
2. install [https://www.npmjs.com/package/sequelize-cli](https://www.npmjs.com/package/sequelize-cli) to migrate Database
3. install postgresql
4. Prepare .env file connect to database
5. run `npm install`
6. Run `npm run dev` ==> Run server local
7. Run `npm run db:migrate` ==> this command is migrate database **(important)** or you can import database from file &#96;databaseCrawedDataShopee.sql&#96;

# How to migrate database

1. Run `npm run db:migration nameOfFile.js` (please replace nametable and Update migrate file content)
2. Run `npm run db:migrate` this command is migrate database(impotant)
3. Run `npm run db:migrate:undo` undo latest migration file

### Folder Structure Conventions

    ├── build                   # Compiled files (`npm run watch-ts` or npm run start:dev`) for local
    ├── dist                    # Compiled files (npm run build) for prod
    ├── src
        ├── index.ts            # app index
        ├── server.ts           # server: run multi core by cluster
        ├── common              # managerment and config sequelize ORM, Mirgation
        ├── config              # Define value for Development and Production
        ├── controllers         # management Logic code folder
        ├── interfaces          # management Interfaces for project
        ├── middlewares         # management Middlewares(query, auth,...)
        ├── model               # management : sequelize define Model and config database
        ├── router              # management : Define RestAPIs and custom APIs
        ├── services            # management Logic code folder
        ├── types               # management func validate,...
    ├── .env                    # enviroments file
    ├── .                       # config file
    ├── .                       # config file
    ├── LICENSE
    └── README.md

### How To Use APIs

- Refer to ERD image: erd-image-craw-shopee.png
- If you use an empty database, you can sync data by calling the api: [http://localhost:4000/api/v1/categories/sync-data]
- To save your time you can import this sql(in the root directory) and use: databaseCrawedDataShopee.sql
- You can refer to image "craw-data-architecture.png" to see how i craw the data from Shopee.vn

- Example: Category restful api.
  Get list : [http://localhost:4000/api/v1/categories](http://localhost:4000/api/v1/categories)
  It has a total of 4 main query params including: fields, page, limit, where, order

1. fields: it's an array, you can get the columns you need or all with ?fields=["$all"] and you can join table
   **example 1:** [http://localhost:4000/api/v1/categories?fields=["title"]](http://localhost:4000/api/v1/categories?fields=["title"])

```json
{
  "id": 11035567,
  "updatedAt": "2023-08-24T08:53:58.722Z",
  "createdAt": "2023-08-24T08:53:58.722Z",
  "title": "Thời Trang Nam"
}
```

**Example 2:** [http://localhost:4000/api/v1/categories?fields=["$all"]](http://localhost:4000/api/v1/categories?fields=["$all"])
The response is:

```json
{
  "id": 11035567,
  "title": "Thời Trang Nam",
  "category_link": null,
  "image": "https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b",
  "createdAt": "2023-08-24T08:53:58.722Z",
  "updatedAt": "2023-08-24T08:53:58.722Z",
  "deletedAt": null
}
```

**example 3:** Join table [http://localhost:4000/api/v1/categories?fields=[%22title%22,%20{%22categories_shops%22:%20[%22$all%22,%20{%22shop%22:[%22$all%22]}]}]](http://localhost:4000/api/v1/categories?fields=[%22title%22,%20{%22categories_shops%22:%20[%22$all%22,%20{%22shop%22:[%22$all%22]}]}])

```json
{
  "id": 11035567,
  "updatedAt": "2023-08-24T08:53:58.722Z",
  "createdAt": "2023-08-24T08:53:58.722Z",
  "title": "Thời Trang Nam",
  "categories_shops": [
    {
      "id": "c3f9a8c0-425b-11ee-91f3-c734cecbfb91",
      "shop_id": 264864918,
      "category_id": 11035567,
      "createdAt": "2023-08-24T08:53:59.244Z",
      "updatedAt": "2023-08-24T08:53:59.244Z",
      "shop": {
          "id": 264864918,
          "name": "Insidemen",
          "shop_link": "https://shopee.vn/insidemen.official",
          "logo": "https://down-vn.img.susercontent.com/file/f4ab0b971d102ca26651885499ba7d40",
          "createdAt": "2023-08-24T08:53:59.243Z",
          "updatedAt": "2023-08-24T08:53:59.243Z"
      }
    }
  ]
}
```

### 2. Page : you can specify the page in the api

**Example 1:** [http://localhost:4000/api/v1/categories?fields=["$all"]&limit=10&page=1](http://localhost:4000/api/v1/categories?fields=["$all"])

### 3. Limit : you can specify the limit in the api

**Example 1:** [http://localhost:4000/api/v1/categories?fields=["$all"]&limit=10&page=1](http://localhost:4000/api/v1/categories?fields=["$all"])

### 4. Where: you can join the table looking for everything with the condition

**example 1:** query with conditon grand_prix:"Spain"
[http://localhost:4000/api/v1/categories?fields=["$all"]&where={"title":"Đồng%20Hồ"}](http://localhost:4000/api/v1/categories?fields=["$all"]&where={"title":"Đồng%20Hồ"})
The resuli is

```json
{
  "count": 1,
  "rows": [
    {
      "id": 11035788,
      "title": "Đồng Hồ",
      "category_link": null,
      "image": "https://down-vn.img.susercontent.com/file/86c294aae72ca1db5f541790f7796260",
      "createdAt": "2023-08-24T08:54:05.665Z",
      "updatedAt": "2023-08-24T08:54:05.665Z",
      "deletedAt": null
    }
  ]
}
```

**example 2:** query join table
`http://localhost:4000/api/v1/products?fields=["$all",{"categories_of_shop":["$all"]}]&where={"$categories_of_shop.shop_id$":"410977670"}`
or
`http://localhost:4000/api/v1/products?fields=["$all",{"categories_of_shop":["$all"]}]&where={"$categories_of_shop.shop_id$":{"$eq":"410977670"}}`
**Detail:** get all products in the shop id "410977670"
_You can refer to more operations at:: https://sequelize.org/docs/v6/core-concepts/model-querying-basics_

### 5. order: you can sort the position of the main table or the child table

**example 1:** api get products of a shop
[http://localhost:4000/api/v1/products?fields=["$all",{"categories_of_shop":["$all"]}]&where={"$categories_of_shop.shop_id$":{"$eq":"410977670"}}&order=[["price","DESC"]]](http://localhost:4000/api/v1/products?fields=["$all",{"categories_of_shop":["$all"]}]&where={"$categories_of_shop.shop_id$":{"$eq":"410977670"}}&order=[["price","DESC"]])

### 6. Postman API docs

you can import JSON postman to see all the api I wrote available:
`crawshopee.json`
or you can use this link:
[https://www.postman.com/orbital-module-engineer-83357203/workspace/captain-hac-workspace/request/26491174-ccae95ff-8771-47f4-9362-9c6518ad4eeb]

    ├── Sync data from shopee   # APIs for sync data
    ├── Categories              # RESTful API of Categories
    ├── Shops                   # RESTful API of Shops
    ├── Products                # RESTful API of Products
    ├── Categories_shops        # RESTful API of Relation table of Main Category table and Shop table
    ├── Categories_Of_Shop      # RESTful API of Categories of a Shop
    ├── Custom                  # Custom api and simulate similar feedback data: https://shopee.vn/



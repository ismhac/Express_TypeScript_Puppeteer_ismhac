# nodejs-express-craw-f1

Here is the server craw data from the formula1.com site including:

1. All data of teams: working and not work (373 record).
2. All data of drivers: working and not work (2101 record).
3. All races from 1950 (1086 record).
4. All race results from 1950 (24098 record).

###### recomend using: Nodejs v14.21.3, TypeScript v5.0.4

# How to run server from local

1. Check node version(14.21.3) and TypeScript [https://www.npmjs.com/package/typescript/v/5.0.4](https://www.npmjs.com/package/typescript/v/5.0.4)
2. install [https://www.npmjs.com/package/sequelize-cli](https://www.npmjs.com/package/sequelize-cli) to migrate Database
3. install postgresql
4. Prepare .env file connect to database
5. run `npm install`
6. Run `npm run start:dev` or parallel (`npm run watch-ts` + `npm run watch-babel`) ==> Run server local
7. Run `npm run db:migrate` ==> this command is migrate database **(important)** or you can import database from file &#96;databaseCrawedDataF1&#96;

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

- Refer to ERD image: erd-image-craw-f1.png
- If you use an empty database, you can sync data by calling the api: [http://localhost:4000/api/v1/races/sync-data]
- To save your time you can import this sql(in the root directory) and use: databaseCrawedDataF1
- You can refer to image "craw-data-architecture.png" to see how i craw the data from F1
- The server will automatically sync data once a day (schedule)
- Example: Race restful api.
  Get list : [http://localhost:4000/api/v1/races](http://localhost:4000/api/v1/races)
  It has a total of 4 main query params including: fields, page, limit, where, order

1. fields: it's an array, you can get the columns you need or all with ?fields=["$all"] and you can join table
   **example 1:** [http://localhost:4000/api/v1/races?fields=["grand_prix"]](http://localhost:4000/api/v1/races?fields=["grand_prix"])

```json
{
  "id": "....",
  "updatedAt": "....",
  "grand_prix": "Spain"
}
```

**Example 2:** [http://localhost:4000/api/v1/races?fields=["$all"]](http://localhost:4000/api/v1/races?fields=["$all"])
The response is:

```json
{
  "id": "xx",
  "grand_prix": "Spain",
  "date": "2023-06-04T05:00:00.000Z",
  "year": 2023,
  "createdAt": "xx",
  "updatedAt": "xx",
  "deletedAt": null
}
```

**example 3:** Join table [http://localhost:4000/api/v1/races?fields=["year",{"drivers_of_race":["$all",{"driver":["$all"]}]}]](http://localhost:4000/api/v1/races?fields=["year",{"drivers_of_race":["$all",{"driver":["$all"]}]}])

```json
{
  "id": "xx",
  "grand_prix": "Spain",
  "date": "2023-06-04T05:00:00.000Z",
  "drivers_of_race": [
    {
      "data of drivers_of_race": "data of drivers_of_race",
      "driver": {
        "data of driver": "data of driver"
      }
    }
  ]
}
```

### 2. Page : you can specify the page in the api

**Example 1:** [http://localhost:4000/api/v1/races?fields=["$all"]&limit=10&page=1](http://localhost:4000/api/v1/races?fields=["$all"])

### 3. Limit : you can specify the limit in the api

**Example 1:** [http://localhost:4000/api/v1/races?fields=["$all"]&limit=10&page=1](http://localhost:4000/api/v1/races?fields=["$all"])

### 4. Where: you can join the table looking for everything with the condition

**example 1:** query with conditon grand_prix:"Spain"
[http://localhost:4000/api/v1/races?fields=["$all"]&where={"grand_prix":"Spain"}](http://localhost:4000/api/v1/races?fields=["$all"]&where={"grand_prix":"Spain"})
The resuli is

```json
{
  "count": 1,
  "rows": [
    {
      "id": "xx",
      "grand_prix": "Spain",
      "date": "xx",
      "year": 2023,
      "createdAt": "xx",
      "updatedAt": "xx",
      "deletedAt": null
    }
  ]
}
```

**example 2:** query join table
`http://localhost:4000/api/v1/drivers?fields=["$all",{"team":["$all"]}]&where={"$team.name$":"McLaren F1 Team"}`
or
`http://localhost:4000/api/v1/drivers?fields=["$all",{"team":["$all"]}]&where={"$team.name$": {"$eq":"McLaren F1 Team"}}`
**Detail:** get all drivers in the team "McLaren F1 Team"
_You can refer to more operations at:: https://sequelize.org/docs/v6/core-concepts/model-querying-basics_

### 5. order: you can sort the position of the main table or the child table

**example 1:** api get raking of a race
[http://localhost:4000/api/v1/drivers-of-race?fields=["$all",{"driver":["$all"]},{"race":["$all"]}]&where={"$race.grand_prix$":"Bahrain"}&order=[["pos","asc"]]](http://localhost:4000/api/v1/drivers-of-race?fields=["$all",{"driver":["$all"]},{"race":["$all"]}]&where={"$race.grand_prix$":"Bahrain"}&order=[["pos","asc"]])

### 6. Postman API docs

you can import JSON postman to see all the api I wrote available:
`crawf1.json`
or you can use this link:
[https://www.postman.com/dark-space-8177-1/workspace/vrillar-test-exam/collection/3867591-b56ba129-e593-413e-85a1-3d7e61214174?action=share&creator=3867591]

    ├── Races                   # RESTful API of Races and custom api
    ├── Sync data from F1       # APIs for sync data
    ├── Driver of race          # RESTful API of race and custom api
    ├── Teams                   # RESTful API of Teams and custom api
    ├── Drivers                 # RESTful API of Drivers and custom api
    ├── Result                  # APIs statistics and simulation of page-like response data: https://www.formula1.com/en/results.html



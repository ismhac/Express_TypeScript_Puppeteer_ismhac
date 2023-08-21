CREATE TABLE "tbl_categories" (
  "id" integer PRIMARY KEY,
  "title" varchar,
  "category_link" varchar,
  "image" json
);

CREATE TABLE "tbl_shops" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "shop_link" varchar,
  "logo" json
);

CREATE TABLE "tbl_categories_shops" (
  "id" integer PRIMARY KEY,
  "shop_id" integer,
  "category_id" integer
);

CREATE TABLE "tbl_categories_of_shop" (
  "id" int PRIMARY KEY,
  "shop_id" integer,
  "title" varchar,
  "link" varchar
);

CREATE TABLE "tbl_products" (
  "id" int PRIMARY KEY,
  "categories_of_shop_id" integer,
  "name" varchar,
  "price" integer,
  "product_link" varchar,
  "images" json
);

ALTER TABLE "tbl_categories_shops" ADD FOREIGN KEY ("shop_id") REFERENCES "tbl_shops" ("id");

ALTER TABLE "tbl_categories_shops" ADD FOREIGN KEY ("category_id") REFERENCES "tbl_categories" ("id");

ALTER TABLE "tbl_categories_of_shop" ADD FOREIGN KEY ("shop_id") REFERENCES "tbl_shops" ("id");

ALTER TABLE "tbl_products" ADD FOREIGN KEY ("categories_of_shop_id") REFERENCES "tbl_categories_of_shop" ("id");

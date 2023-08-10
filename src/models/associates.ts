import {
  Categories,
  Shops,
  CategoriesShops,
  CategoriesOfShop,
  Products
} from '@/models/tables';

console.log('Loading Associate Model.....');

// Categories
CategoriesShops.belongsTo(Categories, {
  foreignKey: 'category_id',
  as: 'category',
})
Categories.hasMany(CategoriesShops, {
  foreignKey: 'categories_shops_id',
  as: 'categories_shops',
})

// Shops
CategoriesShops.belongsTo(Shops, {
  foreignKey: 'shop_id',
  as: 'shop',
})
Shops.hasMany(CategoriesShops, {
  foreignKey: 'categories_shops_id',
  as: 'categories_shops',
})

CategoriesOfShop.belongsTo(Shops, {
  foreignKey: 'shop_id',
  as: 'shop'
})

Shops.hasMany(CategoriesOfShop, {
  foreignKey: 'categories_of_shop_id',
  as: 'categories_of_shop'
})

// Product
Products.belongsTo(CategoriesOfShop, {
  foreignKey: 'categories_of_shop_id',
  as: 'categories_of_shop',
})

CategoriesOfShop.hasMany(Products, {
  foreignKey: 'product_id',
  as: 'products',
})
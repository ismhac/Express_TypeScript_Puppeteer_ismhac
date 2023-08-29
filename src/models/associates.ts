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
  foreignKey: 'category_id',
  as: 'categories_shops'
})

// Shops
CategoriesShops.belongsTo(Shops, {
  foreignKey: 'shop_id',
  as: 'shop',
})

Shops.hasMany(CategoriesShops, {
  foreignKey: 'shop_id',
  as: 'categories_shops'
})

CategoriesOfShop.belongsTo(Shops, {
  foreignKey: 'shop_id',
  as: 'shop'
})

Shops.hasMany(CategoriesOfShop, {
  foreignKey: 'shop_id',
  as: 'categories_of_shops'
})

// Product
Products.belongsTo(CategoriesOfShop, {
  foreignKey: 'categories_of_shop_id',
  as: 'categories_of_shop',
})

CategoriesOfShop.hasMany(Products, {
  foreignKey: 'categories_of_shop_id',
  as: 'products'
})

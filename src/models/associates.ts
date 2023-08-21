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

// Shops
CategoriesShops.belongsTo(Shops, {
  foreignKey: 'shop_id',
  as: 'shop',
})

CategoriesOfShop.belongsTo(Shops, {
  foreignKey: 'shop_id',
  as: 'shop'
})


// Product
Products.belongsTo(CategoriesOfShop, {
  foreignKey: 'categories_of_shop_id',
  as: 'categories_of_shop',
})

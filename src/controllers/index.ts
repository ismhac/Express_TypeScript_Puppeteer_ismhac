import { CrudController } from './crudController';
import { CategoryController } from './crud/categoryController';
import { ProductController } from './crud/productController';
import { ShopController } from './crud/shopController';
import { CategoryShopController } from './crud/categoryShopController';
import { CategoryOfShopController } from './crud/categoryOfShopController';

// SECTION

// Crud

const categoryController = new CategoryController();
const productController = new ProductController();
const shopController = new ShopController();
const categoryShopController = new CategoryShopController();
const categoryOfShopController = new CategoryOfShopController();


// SECTION

export {
  CrudController,
  categoryController,
  productController,
  shopController,
  categoryShopController,
  categoryOfShopController
};

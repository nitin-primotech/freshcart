import type { MenuItem } from '@/features/catalog/types/catalog.types';
import { PRODUCT_IMAGES } from '@/shared/constants/product-images';

const RESTAURANT_ID = 'freshcart';

function product(
  id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  isPopular = false,
): MenuItem {
  return { id, name, description, price, image, isPopular };
}

/** Curated products with images for each category listing screen. */
export const CATEGORY_PRODUCT_CATALOG: Record<string, MenuItem[]> = {
  'cat-household': [
    product(
      'catalog-household-tissue',
      'Soft Tissue Rolls',
      '12 mega rolls · ultra soft',
      12.99,
      PRODUCT_IMAGES.toiletPaper,
      true,
    ),
    product(
      'catalog-household-towels',
      'Paper Towels',
      '6 rolls · absorbent',
      9.49,
      PRODUCT_IMAGES.toiletPaper,
    ),
    product(
      'catalog-household-trash',
      'Trash Bags',
      '30 count · heavy duty',
      7.99,
      PRODUCT_IMAGES.shampoo,
    ),
    product(
      'catalog-household-foil',
      'Aluminum Foil',
      '75 sq ft · kitchen wrap',
      4.29,
      PRODUCT_IMAGES.oliveOil,
    ),
  ],
  'cat-cleaning': [
    product(
      'catalog-clean-dish',
      'Dish Soap',
      '24 fl oz · lemon fresh',
      3.99,
      PRODUCT_IMAGES.shampoo,
      true,
    ),
    product(
      'catalog-clean-floor',
      'Floor Cleaner',
      '32 fl oz · pine scent',
      5.49,
      PRODUCT_IMAGES.shampoo,
    ),
    product(
      'catalog-clean-bleach',
      'Bleach',
      '64 fl oz · disinfecting',
      4.79,
      PRODUCT_IMAGES.waterBottle,
    ),
    product(
      'catalog-clean-wipes',
      'Surface Wipes',
      '80 count · antibacterial',
      6.99,
      PRODUCT_IMAGES.shampoo,
    ),
  ],
  'cat-pet': [
    product(
      'catalog-pet-dog-food',
      'Premium Dog Food',
      '4 lb · chicken & rice',
      14.99,
      PRODUCT_IMAGES.meat,
      true,
    ),
    product(
      'catalog-pet-cat-food',
      'Cat Food Pouches',
      '12 pack · salmon',
      11.49,
      PRODUCT_IMAGES.fish,
    ),
    product(
      'catalog-pet-treats',
      'Pet Treats',
      '8 oz · crunchy bites',
      5.99,
      PRODUCT_IMAGES.cookie,
    ),
    product(
      'catalog-pet-shampoo',
      'Pet Shampoo',
      '16 fl oz · gentle clean',
      8.49,
      PRODUCT_IMAGES.shampoo,
    ),
  ],
  'cat-flowers': [
    product(
      'catalog-flower-roses',
      'Red Rose Bouquet',
      '12 stems · fresh cut',
      18.99,
      PRODUCT_IMAGES.rose,
      true,
    ),
    product(
      'catalog-flower-tulips',
      'Tulip Bunch',
      '10 stems · mixed colors',
      14.99,
      PRODUCT_IMAGES.tulip,
    ),
    product(
      'catalog-flower-plant',
      'Indoor Plant',
      '1 pot · low maintenance',
      12.49,
      PRODUCT_IMAGES.broccoli,
    ),
    product(
      'catalog-flower-incense',
      'Incense Sticks',
      '20 sticks · sandalwood',
      4.99,
      PRODUCT_IMAGES.cookie,
    ),
  ],
  'cat-personal-care': [
    product(
      'catalog-care-shampoo',
      'Moisture Shampoo',
      '12 fl oz · sulfate free',
      7.49,
      PRODUCT_IMAGES.shampoo,
      true,
    ),
    product(
      'catalog-care-soap',
      'Body Wash',
      '18 fl oz · aloe vera',
      6.29,
      PRODUCT_IMAGES.shampoo,
    ),
    product(
      'catalog-fashion-tee',
      'Cotton T-Shirt',
      '1 pc · everyday fit',
      9.99,
      PRODUCT_IMAGES.tshirt,
    ),
    product(
      'catalog-fashion-socks',
      'Ankle Socks',
      '3 pair pack · cotton blend',
      6.99,
      PRODUCT_IMAGES.socks,
    ),
    product(
      'catalog-jewellery-bracelet',
      'Fashion Bracelet',
      '1 pc · gold tone',
      12.99,
      PRODUCT_IMAGES.ring,
    ),
  ],
  'cat-baby': [
    product(
      'catalog-baby-diapers',
      'Baby Diapers',
      '32 count · size 3',
      16.99,
      PRODUCT_IMAGES.milk,
      true,
    ),
    product(
      'catalog-baby-wipes',
      'Baby Wipes',
      '72 count · sensitive',
      4.99,
      PRODUCT_IMAGES.shampoo,
    ),
    product(
      'catalog-toy-blocks',
      'Building Blocks',
      '50 pcs · colorful set',
      11.99,
      PRODUCT_IMAGES.rubikCube,
    ),
    product(
      'catalog-toy-plush',
      'Soft Plush Toy',
      '1 pc · huggable bear',
      9.49,
      PRODUCT_IMAGES.teddyBear,
    ),
  ],
  'cat-health': [
    product(
      'catalog-health-vitamins',
      'Multivitamins',
      '60 tablets · daily',
      13.99,
      PRODUCT_IMAGES.pills,
      true,
    ),
    product(
      'catalog-health-sanitizer',
      'Hand Sanitizer',
      '8 fl oz · 70% alcohol',
      3.49,
      PRODUCT_IMAGES.waterBottle,
    ),
    product(
      'catalog-pharma-bandage',
      'First Aid Kit',
      '42 pieces · travel size',
      8.99,
      PRODUCT_IMAGES.bandage,
    ),
    product(
      'catalog-pharma-pain',
      'Pain Relief Tablets',
      '24 count · fast acting',
      5.99,
      PRODUCT_IMAGES.pills,
    ),
  ],
  'cat-beverages': [
    product(
      'catalog-summer-juice',
      'Fresh Orange Juice',
      '52 fl oz · no pulp',
      4.49,
      PRODUCT_IMAGES.juice,
      true,
    ),
    product(
      'catalog-summer-water',
      'Mineral Water',
      '24 pack · 16.9 fl oz',
      5.99,
      PRODUCT_IMAGES.waterBottle,
    ),
    product(
      'catalog-summer-lemonade',
      'Lemonade',
      '64 fl oz · chilled',
      3.99,
      PRODUCT_IMAGES.lemon,
    ),
    product(
      'catalog-summer-tea',
      'Iced Tea',
      '12 pack · peach flavor',
      6.49,
      PRODUCT_IMAGES.tea,
    ),
  ],
  'cat-meat-seafood': [
    product(
      'catalog-meat-chicken',
      'Chicken Breast',
      '1 lb · boneless skinless',
      6.99,
      PRODUCT_IMAGES.meat,
      true,
    ),
    product(
      'catalog-meat-beef',
      'Ground Beef',
      '1 lb · 85% lean',
      7.49,
      PRODUCT_IMAGES.meat,
    ),
    product(
      'catalog-meat-salmon',
      'Atlantic Salmon',
      '12 oz · fresh fillet',
      11.99,
      PRODUCT_IMAGES.fish,
    ),
    product(
      'catalog-bbq-buns',
      'Burger Buns',
      '8 count · sesame seed',
      3.29,
      PRODUCT_IMAGES.bread,
    ),
  ],
  'cat-snacks': [
    product(
      'catalog-snack-chips',
      "Lay's Classic Chips",
      '7.75 oz bag',
      3.49,
      PRODUCT_IMAGES.potatoChips,
      true,
    ),
    product(
      'catalog-snack-cookies',
      'Chocolate Cookies',
      '12 oz · crunchy',
      4.29,
      PRODUCT_IMAGES.cookie,
    ),
    product(
      'catalog-gift-basket',
      'Snack Gift Box',
      'Assorted · party pack',
      15.99,
      PRODUCT_IMAGES.potatoChips,
    ),
    product(
      'catalog-snack-nuts',
      'Mixed Nuts',
      '10 oz · lightly salted',
      5.99,
      PRODUCT_IMAGES.almond,
    ),
  ],
  'cat-fruits-veg': [
    product(
      'catalog-fruit-strawberry',
      'Fresh Strawberries',
      '1 lb · sweet & juicy',
      3.99,
      PRODUCT_IMAGES.strawberry,
      true,
    ),
    product(
      'catalog-fruit-banana',
      'Banana Cavendish',
      '1 bunch · ripe & ready',
      1.59,
      PRODUCT_IMAGES.banana,
    ),
    product(
      'catalog-fruit-avocado',
      'Hass Avocado',
      '1 pc · creamy & ripe',
      2.49,
      PRODUCT_IMAGES.avocado,
    ),
    product(
      'catalog-veg-tomato',
      'Vine Tomatoes',
      '1 lb · farm fresh',
      2.99,
      PRODUCT_IMAGES.tomato,
    ),
  ],
  'cat-dairy-eggs': [
    product(
      'catalog-dairy-milk',
      'Organic Whole Milk',
      'Half gallon · pasture raised',
      4.99,
      PRODUCT_IMAGES.milk,
      true,
    ),
    product(
      'catalog-dairy-eggs',
      'Grade A Eggs',
      '12 count · cage free',
      5.49,
      PRODUCT_IMAGES.egg,
    ),
    product(
      'catalog-dairy-cheese',
      'Cheddar Cheese',
      '8 oz block · sharp',
      4.29,
      PRODUCT_IMAGES.cheese,
    ),
    product(
      'catalog-dairy-yogurt',
      'Greek Yogurt',
      '32 oz · plain',
      5.99,
      PRODUCT_IMAGES.yogurt,
    ),
  ],
  'cat-bakery': [
    product(
      'catalog-bakery-bread',
      'Whole Wheat Bread',
      '20 oz loaf · multigrain',
      3.29,
      PRODUCT_IMAGES.bread,
      true,
    ),
    product(
      'catalog-bakery-croissant',
      'Butter Croissant',
      '4 pack · flaky',
      5.49,
      PRODUCT_IMAGES.croissant,
    ),
    product(
      'catalog-bakery-muffin',
      'Blueberry Muffin',
      '4 pack · bakery fresh',
      4.99,
      PRODUCT_IMAGES.muffin,
    ),
  ],
  'cat-pantry': [
    product(
      'catalog-pantry-pasta',
      'Organic Penne Pasta',
      '16 oz · durum wheat',
      2.29,
      PRODUCT_IMAGES.pasta,
      true,
    ),
    product(
      'catalog-pantry-oil',
      'Extra Virgin Olive Oil',
      '16.9 fl oz · cold pressed',
      8.99,
      PRODUCT_IMAGES.oliveOil,
    ),
    product(
      'catalog-pantry-rice',
      'Basmati Rice',
      '2 lb · long grain',
      4.49,
      PRODUCT_IMAGES.rice,
    ),
  ],
  'cat-cereals': [
    product(
      'catalog-cereal-flakes',
      'Corn Flakes',
      '18 oz · crispy',
      4.29,
      PRODUCT_IMAGES.cookie,
      true,
    ),
    product(
      'catalog-cereal-oats',
      'Rolled Oats',
      '42 oz · whole grain',
      5.49,
      PRODUCT_IMAGES.porridge,
    ),
    product(
      'catalog-books-magazine',
      'Cookbook',
      '1 pc · quick recipes',
      9.99,
      PRODUCT_IMAGES.book,
    ),
  ],
  'cat-frozen': [
    product(
      'catalog-frozen-berries',
      'Frozen Blueberries',
      '12 oz · antioxidant rich',
      4.49,
      PRODUCT_IMAGES.blueberries,
      true,
    ),
    product(
      'catalog-frozen-pizza',
      'Frozen Pizza',
      '12 inch · pepperoni',
      6.99,
      PRODUCT_IMAGES.pizza,
    ),
    product(
      'catalog-frozen-icecream',
      'Vanilla Ice Cream',
      '1.5 qt · creamy',
      5.49,
      PRODUCT_IMAGES.iceCream,
    ),
  ],
  'cat-canned': [
    product(
      'catalog-canned-tomato',
      'Canned Tomatoes',
      '14.5 oz · diced',
      1.99,
      PRODUCT_IMAGES.tomato,
      true,
    ),
    product(
      'catalog-canned-beans',
      'Black Beans',
      '15 oz · ready to eat',
      1.49,
      PRODUCT_IMAGES.greenBean,
    ),
    product(
      'catalog-canned-soup',
      'Vegetable Soup',
      '18.6 oz · hearty',
      2.29,
      PRODUCT_IMAGES.soup,
    ),
  ],
  'cat-organic': [
    product(
      'catalog-organic-broccoli',
      'Organic Broccoli',
      '1 bunch · fresh',
      2.99,
      PRODUCT_IMAGES.broccoli,
      true,
    ),
    product(
      'catalog-organic-apple',
      'Organic Apples',
      '2 lb bag · crisp',
      4.49,
      PRODUCT_IMAGES.apple,
    ),
    product(
      'catalog-organic-spinach',
      'Organic Spinach',
      '5 oz · baby leaves',
      3.49,
      PRODUCT_IMAGES.spinach,
    ),
  ],
  'cat-gluten-free': [
    product(
      'catalog-gf-bread',
      'Gluten Free Bread',
      '18 oz · soft loaf',
      5.99,
      PRODUCT_IMAGES.bread,
      true,
    ),
    product(
      'catalog-gf-pasta',
      'Gluten Free Pasta',
      '12 oz · rice based',
      3.99,
      PRODUCT_IMAGES.pasta,
    ),
  ],
  'cat-international': [
    product(
      'catalog-intl-pasta',
      'Italian Pasta',
      '16 oz · imported',
      3.49,
      PRODUCT_IMAGES.pasta,
      true,
    ),
    product(
      'catalog-intl-sauce',
      'Curry Sauce',
      '12 oz · medium spice',
      4.29,
      PRODUCT_IMAGES.sauce,
    ),
    product(
      'catalog-intl-noodles',
      'Ramen Noodles',
      '5 pack · instant',
      2.99,
      PRODUCT_IMAGES.noodle,
    ),
  ],
};

const ITEM_CATEGORY_LOOKUP = new Map<string, string>(
  Object.entries(CATEGORY_PRODUCT_CATALOG).flatMap(([categoryId, items]) =>
    items.map((item) => [item.id, categoryId]),
  ),
);

export function getCategoryCatalogProducts(categoryId: string): MenuItem[] {
  return CATEGORY_PRODUCT_CATALOG[categoryId] ?? [];
}

export function findCategoryCatalogItem(itemId: string): MenuItem | null {
  for (const items of Object.values(CATEGORY_PRODUCT_CATALOG)) {
    const match = items.find((entry) => entry.id === itemId);
    if (match) return match;
  }
  return null;
}

export function getCategoryIdForCatalogItem(itemId: string): string | null {
  return ITEM_CATEGORY_LOOKUP.get(itemId) ?? null;
}

export function getCategoryCatalogRestaurantId(): string {
  return RESTAURANT_ID;
}

export function getCategoryCatalogSectionTitle(categoryId: string): string {
  const names: Record<string, string> = {
    'cat-household': 'Household Essentials',
    'cat-cleaning': 'Cleaning Supplies',
    'cat-pet': 'Pet Supplies',
    'cat-flowers': 'Flowers & Plants',
    'cat-personal-care': 'Personal Care & Fashion',
    'cat-baby': 'Baby Care & Toys',
    'cat-health': 'Health & Wellness',
    'cat-beverages': 'Summer Essentials',
    'cat-meat-seafood': 'BBQ & Meat',
    'cat-snacks': 'Snacks & Gifts',
  };
  return names[categoryId] ?? 'Featured Products';
}

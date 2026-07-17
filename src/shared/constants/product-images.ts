/** Verified pngimg.com product URLs (HTTP 200). */
export const PRODUCT_IMAGES = {
  almond: 'https://pngimg.com/uploads/almond/almond_PNG24.png',
  apple: 'https://pngimg.com/uploads/apple/apple_PNG12439.png',
  avocado: 'https://pngimg.com/uploads/avocado/avocado_PNG15514.png',
  banana: 'https://pngimg.com/uploads/banana/banana_PNG843.png',
  bandage: 'https://pngimg.com/uploads/bandage/bandage_PNG6.png',
  blueberries: 'https://pngimg.com/uploads/blueberries/blueberries_PNG4.png',
  book: 'https://pngimg.com/uploads/book/book_PNG2111.png',
  bread: 'https://pngimg.com/uploads/bread/bread_PNG2253.png',
  broccoli: 'https://pngimg.com/uploads/broccoli/broccoli_PNG2820.png',
  butter: 'https://pngimg.com/uploads/butter/butter_PNG32.png',
  carrot: 'https://pngimg.com/uploads/carrot/carrot_PNG4987.png',
  cheese: 'https://pngimg.com/uploads/cheese/cheese_PNG25332.png',
  cookie: 'https://pngimg.com/uploads/cookie/cookie_PNG13664.png',
  croissant: 'https://pngimg.com/uploads/croissant/croissant_PNG1.png',
  egg: 'https://pngimg.com/uploads/egg/egg_PNG25.png',
  fish: 'https://pngimg.com/uploads/fish/fish_PNG25176.png',
  greenBean: 'https://pngimg.com/uploads/green_bean/green_bean_PNG1.png',
  iceCream: 'https://pngimg.com/uploads/ice_cream/ice_cream_PNG5099.png',
  juice: 'https://pngimg.com/uploads/juice/juice_PNG7152.png',
  lemon: 'https://pngimg.com/uploads/lemon/lemon_PNG25189.png',
  meat: 'https://pngimg.com/uploads/meat/meat_PNG98313.png',
  milk: 'https://pngimg.com/uploads/milk/milk_PNG12716.png',
  muffin: 'https://pngimg.com/uploads/muffin/muffin_PNG68.png',
  noodle: 'https://pngimg.com/uploads/noodle/noodle_PNG1.png',
  oliveOil: 'https://pngimg.com/uploads/olive_oil/olive_oil_PNG9.png',
  orange: 'https://pngimg.com/uploads/orange/orange_PNG789.png',
  pasta: 'https://pngimg.com/uploads/pasta/pasta_PNG58.png',
  pills: 'https://pngimg.com/uploads/pills/pills_PNG16491.png',
  pizza: 'https://pngimg.com/uploads/pizza/pizza_PNG43991.png',
  porridge: 'https://pngimg.com/uploads/porridge/porridge_PNG1.png',
  potatoChips: 'https://pngimg.com/uploads/potato_chips/potato_chips_PNG6.png',
  rice: 'https://pngimg.com/uploads/rice/rice_PNG1.png',
  ring: 'https://pngimg.com/uploads/ring/ring_PNG1.png',
  rose: 'https://pngimg.com/uploads/rose/rose_PNG658.png',
  rubikCube: 'https://pngimg.com/uploads/rubik_cube/rubik_cube_PNG1.png',
  sauce: 'https://pngimg.com/uploads/sauce/sauce_PNG58.png',
  shampoo: 'https://pngimg.com/uploads/shampoo/shampoo_PNG11.png',
  socks: 'https://pngimg.com/uploads/socks/socks_PNG8213.png',
  soup: 'https://pngimg.com/uploads/soup/soup_PNG1.png',
  spinach: 'https://pngimg.com/uploads/spinach/spinach_PNG10.png',
  strawberry: 'https://pngimg.com/uploads/strawberry/strawberry_PNG2630.png',
  tea: 'https://pngimg.com/uploads/tea/tea_PNG16893.png',
  teddyBear: 'https://pngimg.com/uploads/teddy_bear/teddy_bear_PNG45.png',
  toiletPaper:
    'https://pngimg.com/uploads/toilet_paper/toilet_paper_PNG99648.png',
  tomato: 'https://pngimg.com/uploads/tomato/tomato_PNG12563.png',
  tshirt: 'https://pngimg.com/uploads/tshirt/tshirt_PNG5425.png',
  tulip: 'https://pngimg.com/uploads/tulip/tulip_PNG8978.png',
  waterBottle:
    'https://pngimg.com/uploads/water_bottle/water_bottle_PNG10144.png',
  yogurt: 'https://pngimg.com/uploads/yogurt/yogurt_PNG15164.png',
} as const;

export const DEFAULT_PRODUCT_IMAGE = PRODUCT_IMAGES.strawberry;

/** Legacy pngimg URLs that 404 — mapped to verified replacements. */
const BROKEN_PRODUCT_IMAGE_REMAP: Record<string, string> = {
  'https://pngimg.com/uploads/beans/beans_PNG1367.png':
    PRODUCT_IMAGES.greenBean,
  'https://pngimg.com/uploads/broccoli/broccoli_PNG10.png':
    PRODUCT_IMAGES.broccoli,
  'https://pngimg.com/uploads/croissant/croissant_PNG91077.png':
    PRODUCT_IMAGES.croissant,
  'https://pngimg.com/uploads/cube/cube_PNG24.png': PRODUCT_IMAGES.rubikCube,
  'https://pngimg.com/uploads/egg/egg_PNG11526.png': PRODUCT_IMAGES.egg,
  'https://pngimg.com/uploads/fish/fish_PNG25186.png': PRODUCT_IMAGES.fish,
  'https://pngimg.com/uploads/meat/meat_PNG13111.png': PRODUCT_IMAGES.meat,
  'https://pngimg.com/uploads/noodles/noodles_PNG59.png': PRODUCT_IMAGES.noodle,
  'https://pngimg.com/uploads/oats/oats_PNG23.png': PRODUCT_IMAGES.porridge,
  'https://pngimg.com/uploads/orange_juice/orange_juice_PNG7.png':
    PRODUCT_IMAGES.juice,
  'https://pngimg.com/uploads/pill/pill_PNG128.png': PRODUCT_IMAGES.pills,
  'https://pngimg.com/uploads/plastic_bottle/plastic_bottle_PNG3.png':
    PRODUCT_IMAGES.waterBottle,
  'https://pngimg.com/uploads/rice/rice_PNG3287.png': PRODUCT_IMAGES.rice,
  'https://pngimg.com/uploads/ring/ring_PNG19525.png': PRODUCT_IMAGES.ring,
  'https://pngimg.com/uploads/socks/socks_PNG18.png': PRODUCT_IMAGES.socks,
  'https://pngimg.com/uploads/soup/soup_PNG10813.png': PRODUCT_IMAGES.soup,
  'https://pngimg.com/uploads/t_shirt/t_shirt_PNG5437.png':
    PRODUCT_IMAGES.tshirt,
  'https://pngimg.com/uploads/tea/tea_PNG835.png': PRODUCT_IMAGES.tea,
  'https://pngimg.com/uploads/toilet_paper/toilet_paper_PNG19274.png':
    PRODUCT_IMAGES.toiletPaper,
  'https://pngimg.com/uploads/tulip/tulip_PNG47.png': PRODUCT_IMAGES.tulip,
  'https://pngimg.com/uploads/yogurt/yogurt_PNG21.png': PRODUCT_IMAGES.yogurt,
};

export function resolveProductImageUri(
  image: string | undefined,
): string | undefined {
  if (!image?.startsWith('http')) {
    return undefined;
  }

  return BROKEN_PRODUCT_IMAGE_REMAP[image] ?? image;
}

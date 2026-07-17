import type { Href } from 'expo-router';

export type DietLifestyleItem = {
  id: string;
  name: string;
  icon: string;
  href: Href;
};

export type TopCategoryBanner = {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  accentColor: string;
  image: string;
  categoryId: string;
};

export type LifestyleStoreItem = {
  id: string;
  name: string;
  bgColor: string;
  categoryId: string;
  image?: number;
  renderIcon?: 'books' | 'pharma' | 'gifts' | 'jewellery';
};

export const LIFESTYLE_STORE_ITEMS: LifestyleStoreItem[] = [
  {
    id: 'spiritual',
    name: 'Spiritual\nNeeds',
    bgColor: '#FDF6E2',
    categoryId: 'cat-flowers',
    image: require('@/assets/images/lifestyle_spiritual.png'),
  },
  {
    id: 'pet',
    name: 'Pet\nStore',
    bgColor: '#EDF3E8',
    categoryId: 'cat-pet',
    image: require('@/assets/images/lifestyle_pet.png'),
  },
  {
    id: 'fashion',
    name: 'Fashion\nBasics',
    bgColor: '#ECEFFD',
    categoryId: 'cat-personal-care',
    image: require('@/assets/images/lifestyle_fashion.png'),
  },
  {
    id: 'toy',
    name: 'Toy\nStore',
    bgColor: '#FDECE7',
    categoryId: 'cat-baby',
    image: require('@/assets/images/lifestyle_toy.png'),
  },
  {
    id: 'books',
    name: 'Book\nStore',
    bgColor: '#F3F3F3',
    categoryId: 'cat-international',
    renderIcon: 'books',
  },
  {
    id: 'pharma',
    name: 'Pharma\nStore',
    bgColor: '#E3F3FD',
    categoryId: 'cat-health',
    renderIcon: 'pharma',
  },
  {
    id: 'gifts',
    name: 'E-Gifts\nStore',
    bgColor: '#FEF7D1',
    categoryId: 'cat-snacks',
    renderIcon: 'gifts',
  },
  {
    id: 'jewellery',
    name: 'Jewellery\nStore',
    bgColor: '#FCEEF3',
    categoryId: 'cat-personal-care',
    renderIcon: 'jewellery',
  },
];

export const DIET_LIFESTYLE_ITEMS: DietLifestyleItem[] = [
  {
    id: 'diet-gluten-free',
    name: 'Gluten Free',
    icon: 'leaf.fill',
    href: '/category/cat-gluten-free',
  },
  {
    id: 'diet-organic',
    name: 'Organic',
    icon: 'sparkles',
    href: '/category/cat-organic',
  },
  {
    id: 'diet-vegan',
    name: 'Vegan',
    icon: 'leaf.fill',
    href: '/category/cat-fruits-veg',
  },
  {
    id: 'diet-keto',
    name: 'Keto',
    icon: 'flame.fill',
    href: '/category/cat-meat-seafood',
  },
  {
    id: 'diet-low-carb',
    name: 'Low Carb',
    icon: 'bolt.fill',
    href: '/category/cat-dairy-eggs',
  },
  {
    id: 'diet-no-sugar',
    name: 'No Sugar Added',
    icon: 'cup.and.saucer.fill',
    href: '/category/cat-beverages',
  },
];

export const TOP_CATEGORY_BANNERS: TopCategoryBanner[] = [
  {
    id: 'banner-summer',
    title: 'Summer Essentials',
    subtitle: 'Stay cool this summer',
    backgroundColor: '#E3F2FD',
    accentColor: '#1565C0',
    image: 'https://pngimg.com/uploads/juice/juice_PNG7152.png',
    categoryId: 'cat-beverages',
  },
  {
    id: 'banner-bbq',
    title: 'BBQ Party Must-Haves',
    subtitle: 'Everything for your BBQ',
    backgroundColor: '#FFF3E0',
    accentColor: '#E65100',
    image: 'https://pngimg.com/uploads/meat/meat_PNG98313.png',
    categoryId: 'cat-meat-seafood',
  },
  {
    id: 'banner-school',
    title: 'Back to School',
    subtitle: 'Snacks, lunch & more',
    backgroundColor: '#F3E5F5',
    accentColor: '#6A1B9A',
    image: 'https://pngimg.com/uploads/potato_chips/potato_chips_PNG6.png',
    categoryId: 'cat-snacks',
  },
];

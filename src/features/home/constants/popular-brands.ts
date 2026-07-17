import type { ImageSource } from 'expo-image';

export type PopularBrand = {
  id: string;
  name: string;
  image: ImageSource;
  searchQuery: string;
};

export const POPULAR_BRANDS: PopularBrand[] = [
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    searchQuery: 'Coca-Cola',
    image: require('@/assets/images/brands/nestle.png'),
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    searchQuery: 'Pepsi',
    image: require('@/assets/images/brands/parle.png'),
  },
  {
    id: 'quaker',
    name: 'Quaker',
    searchQuery: 'Quaker oats',
    image: require('@/assets/images/brands/britannia.png'),
  },
  {
    id: 'kelloggs',
    name: "Kellogg's",
    searchQuery: "Kellogg's",
    image: require('@/assets/images/brands/britannia.png'),
  },
  {
    id: 'tropicana',
    name: 'Tropicana',
    searchQuery: 'Tropicana juice',
    image: require('@/assets/images/brands/tata.png'),
  },
  {
    id: 'nabisco',
    name: 'Nabisco',
    searchQuery: 'Nabisco biscuits',
    image: require('@/assets/images/brands/amul.png'),
  },
  {
    id: 'amazon-fresh',
    name: 'Amazon Fresh',
    searchQuery: 'Amazon Fresh',
    image: require('@/assets/images/brands/bikaner.png'),
  },
];

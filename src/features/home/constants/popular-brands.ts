import type { ImageSource } from 'expo-image';

export type PopularBrand = {
  id: string;
  name: string;
  image: ImageSource;
};

export const POPULAR_BRANDS: PopularBrand[] = [
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    image: require('@/assets/images/brands/nestle.png'),
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    image: require('@/assets/images/brands/parle.png'),
  },
  {
    id: 'quaker',
    name: 'Quaker',
    image: require('@/assets/images/brands/britannia.png'),
  },
  {
    id: 'kelloggs',
    name: "Kellogg's",
    image: require('@/assets/images/brands/britannia.png'),
  },
  {
    id: 'tropicana',
    name: 'Tropicana',
    image: require('@/assets/images/brands/tata.png'),
  },
  {
    id: 'nabisco',
    name: 'Nabisco',
    image: require('@/assets/images/brands/amul.png'),
  },
  {
    id: 'amazon-fresh',
    name: 'Amazon Fresh',
    image: require('@/assets/images/brands/bikaner.png'),
  },
];

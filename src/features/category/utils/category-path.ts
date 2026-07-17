import type { Href } from 'expo-router';

export function categoryPath(categoryId: string): Href {
  return `/category/${categoryId}` as Href;
}

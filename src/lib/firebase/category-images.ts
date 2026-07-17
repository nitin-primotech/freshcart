import { resolveProductImageUri } from '@/shared/constants/product-images';

export function isHttpImageUrl(value: string | undefined): boolean {
  return Boolean(value?.startsWith('http://') || value?.startsWith('https://'));
}

export function resolveCategoryImageUri(
  image: string | undefined,
): string | undefined {
  return resolveProductImageUri(image);
}

export { resolveProductImageUri } from '@/shared/constants/product-images';

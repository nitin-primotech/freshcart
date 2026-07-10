export function isHttpImageUrl(value: string | undefined): boolean {
  return Boolean(value?.startsWith('http://') || value?.startsWith('https://'));
}

export function resolveCategoryImageUri(
  image: string | undefined,
): string | undefined {
  return isHttpImageUrl(image) ? image : undefined;
}

/** Maps menu section ids to catalog category ids for filtered category listings. */
export const MENU_SECTION_CATEGORIES: Record<string, string> = {
  'sec-fruits': 'cat-fruits-veg',
  'sec-dairy': 'cat-dairy-eggs',
  'sec-bakery': 'cat-bakery',
  'sec-snacks': 'cat-snacks',
  'sec-beverages': 'cat-beverages',
  'sec-pantry': 'cat-pantry',
  'sec-personal-care': 'cat-personal-care',
};

export function menuSectionMatchesCategory(
  sectionId: string,
  categoryId: string,
): boolean {
  return MENU_SECTION_CATEGORIES[sectionId] === categoryId;
}

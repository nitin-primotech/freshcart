/** Primary menu section for 1:1 category listings. */
export const MENU_SECTION_CATEGORIES: Record<string, string> = {
  'sec-fruits': 'cat-fruits-veg',
  'sec-dairy': 'cat-dairy-eggs',
  'sec-bakery': 'cat-bakery',
  'sec-snacks': 'cat-snacks',
  'sec-beverages': 'cat-beverages',
  'sec-pantry': 'cat-pantry',
  'sec-personal-care': 'cat-personal-care',
};

/**
 * Menu sections whose products appear on each category screen.
 * Used when a category has no dedicated menu section in the catalog.
 */
export const CATEGORY_MENU_SECTIONS: Record<string, string[]> = {
  'cat-fruits-veg': ['sec-fruits'],
  'cat-dairy-eggs': ['sec-dairy'],
  'cat-meat-seafood': ['sec-dairy', 'sec-pantry'],
  'cat-bakery': ['sec-bakery'],
  'cat-pantry': ['sec-pantry'],
  'cat-beverages': ['sec-beverages'],
  'cat-snacks': ['sec-snacks'],
  'cat-cereals': ['sec-bakery', 'sec-snacks'],
  'cat-frozen': ['sec-fruits'],
  'cat-canned': ['sec-pantry'],
  'cat-baby': ['sec-dairy'],
  'cat-personal-care': ['sec-personal-care'],
  'cat-household': ['sec-personal-care', 'sec-pantry'],
  'cat-cleaning': ['sec-personal-care'],
  'cat-health': ['sec-beverages', 'sec-personal-care'],
  'cat-organic': ['sec-fruits'],
  'cat-gluten-free': ['sec-bakery'],
  'cat-pet': ['sec-snacks'],
  'cat-international': ['sec-pantry'],
  'cat-flowers': ['sec-fruits'],
};

export function getMenuSectionsForCategory(categoryId: string): string[] {
  return CATEGORY_MENU_SECTIONS[categoryId] ?? [];
}

export function menuSectionMatchesCategory(
  sectionId: string,
  categoryId: string,
): boolean {
  const direct = MENU_SECTION_CATEGORIES[sectionId];
  if (direct === categoryId) return true;

  return getMenuSectionsForCategory(categoryId).includes(sectionId);
}

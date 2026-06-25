export const DIETARY_OPTIONS = [
  { id: 'veg' as const, label: 'Veg only', icon: 'leaf.fill' },
  { id: 'non_veg' as const, label: 'Non-veg', icon: 'flame.fill' },
  { id: 'vegan' as const, label: 'Vegan', icon: 'heart.fill' },
  { id: 'eggetarian' as const, label: 'Eggetarian', icon: 'circle.fill' },
] as const;

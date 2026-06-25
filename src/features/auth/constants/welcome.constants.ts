type WelcomeFeature = {
  icon: string;
  label: string;
  tint: 'success' | 'primary';
};

type WelcomeGalleryLayout = {
  glow: string;
  rotate: string;
  layout: 'left' | 'center' | 'right';
};

export const WELCOME_FEATURES: WelcomeFeature[] = [
  { icon: 'bicycle', label: 'Lightning fast delivery', tint: 'success' },
  { icon: 'shield.fill', label: 'Safe & reliable', tint: 'primary' },
  {
    icon: 'building.columns.fill',
    label: '1000+ restaurants',
    tint: 'success',
  },
];

export const WELCOME_GALLERY_LAYOUT: WelcomeGalleryLayout[] = [
  {
    glow: '0 14px 36px rgba(45, 106, 79, 0.28)',
    rotate: '-11deg',
    layout: 'left',
  },
  {
    glow: '0 16px 40px rgba(139, 92, 246, 0.3)',
    rotate: '0deg',
    layout: 'center',
  },
  {
    glow: '0 14px 36px rgba(236, 72, 153, 0.28)',
    rotate: '11deg',
    layout: 'right',
  },
];

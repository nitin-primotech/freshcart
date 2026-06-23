type AuthPerk = {
  icon: keyof typeof AUTH_ICON_NAMES;
  label: string;
};

/** Maps perk keys to icon-registry names */
export const AUTH_ICON_NAMES = {
  bicycle: 'bicycle',
  bolt: 'bolt.fill',
  shield: 'shield.fill',
  crown: 'crown.fill',
  tag: 'tag.fill',
  fork: 'fork.knife',
  headphones: 'headphones',
  person: 'person.fill',
  heart: 'heart.fill',
  clock: 'clock',
} as const;

export type AuthOnboardingCopy = {
  line1: string;
  line2: string;
  showSpeedLines?: boolean;
  tagline: string;
  trust: AuthPerk[];
};

export const PHONE_ONBOARDING_COPY: AuthOnboardingCopy = {
  line1: 'Good food,',
  line2: 'delivered fast',
  showSpeedLines: true,
  tagline: 'Quick delivery • Safe & reliable • 1000+ restaurants',
  trust: [
    { icon: 'bolt', label: 'Lightning fast delivery' },
    { icon: 'shield', label: 'Safe & reliable' },
    { icon: 'fork', label: '1000+ restaurants' },
  ],
};

export const NAME_ONBOARDING_COPY: AuthOnboardingCopy = {
  line1: 'Great food starts',
  line2: 'with your name',
  showSpeedLines: true,
  tagline: 'Personalised • Best offers • Fast checkout',
  trust: [
    { icon: 'person', label: 'Personalised for you' },
    { icon: 'tag', label: 'Exclusive offers' },
    { icon: 'heart', label: 'Faster checkout' },
  ],
};

export const OTP_ONBOARDING_COPY: AuthOnboardingCopy = {
  line1: 'Almost there,',
  line2: 'verify OTP',
  showSpeedLines: true,
  tagline: 'Secure login • Quick verify • Stay signed in',
  trust: [
    { icon: 'shield', label: 'Secure login' },
    { icon: 'clock', label: 'Quick verify' },
    { icon: 'heart', label: 'Stay signed in' },
  ],
};

export function resolveAuthIcon(key: AuthPerk['icon']): string {
  return AUTH_ICON_NAMES[key];
}

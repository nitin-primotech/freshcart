import { PopularBrandsSection } from '@/features/home/components/popular-brands-section';
import { spacing } from '@/theme/spacing';

export function SearchTopBrandsSection() {
  return (
    <PopularBrandsSection
      title="Top Brands"
      cardWidth={68}
      logoSize={56}
      rowGap={spacing.md}
    />
  );
}

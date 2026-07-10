import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { TopPicksProductCard } from './top-picks-product-card';

type PopularProductCardProps = {
  dish: RecommendedDish;
  width: number;
  showDescription?: boolean;
};

export function PopularProductCard({ dish, width }: PopularProductCardProps) {
  return <TopPicksProductCard dish={dish} width={width} />;
}

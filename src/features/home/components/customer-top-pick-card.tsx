import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { TopPicksProductCard } from './top-picks-product-card';

type CustomerTopPickCardProps = {
  dish: RecommendedDish;
  width: number;
};

export function CustomerTopPickCard({ dish, width }: CustomerTopPickCardProps) {
  return <TopPicksProductCard dish={dish} width={width} />;
}

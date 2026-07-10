import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { TopPicksProductCard } from './top-picks-product-card';

type GroceryDealCardProps = {
  dish: RecommendedDish;
  width: number;
  index: number;
};

export function GroceryDealCard({ dish, width }: GroceryDealCardProps) {
  return <TopPicksProductCard dish={dish} width={width} />;
}

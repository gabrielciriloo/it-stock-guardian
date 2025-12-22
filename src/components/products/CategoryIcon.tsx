import { ProductCategory } from '@/types/inventory';
import {
  Monitor,
  Laptop,
  Printer,
  Mouse,
  HardDrive,
  Cable,
  Droplet,
  Network,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  category: ProductCategory;
  className?: string;
}

const categoryIcons: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  computer: Laptop,
  monitor: Monitor,
  printer: Printer,
  peripheral: Mouse,
  parts: HardDrive,
  cables: Cable,
  toner: Droplet,
  network: Network,
  other: Package,
};

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const Icon = categoryIcons[category];
  return <Icon className={cn('w-5 h-5', className)} />;
}

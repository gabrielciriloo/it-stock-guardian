import { Badge } from '@/components/ui/badge';
import { ProductStatus, statusLabels } from '@/types/inventory';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const statusVariants: Record<ProductStatus, 'available' | 'inUse' | 'maintenance' | 'discarded'> = {
  available: 'available',
  'in-use': 'inUse',
  maintenance: 'maintenance',
  discarded: 'discarded',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]} className={cn(className)}>
      {statusLabels[status]}
    </Badge>
  );
}

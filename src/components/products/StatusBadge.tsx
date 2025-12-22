import { Badge } from '@/components/ui/badge';
import { ProductStatus, statusLabels } from '@/types/inventory';

interface StatusBadgeProps {
  status: ProductStatus;
}

const statusVariants: Record<ProductStatus, 'available' | 'inUse' | 'maintenance' | 'discarded'> = {
  available: 'available',
  'in-use': 'inUse',
  maintenance: 'maintenance',
  discarded: 'discarded',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {statusLabels[status]}
    </Badge>
  );
}

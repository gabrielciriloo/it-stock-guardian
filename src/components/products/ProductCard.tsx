import { Product, categoryLabels } from '@/types/inventory';
import { Card } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { MapPin, Hash, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="p-3 sm:p-4 hover:shadow-card transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-border/50 bg-card animate-fade-in">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <CategoryIcon category={product.category} className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-card-foreground truncate text-sm sm:text-base">{product.name}</h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg sm:text-2xl font-bold text-primary">{product.quantity}</span>
                <StatusBadge status={product.status} className="hidden sm:flex" />
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
              {product.brand} {product.model}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-2 sm:mt-3 text-xs text-muted-foreground">
              <StatusBadge status={product.status} className="sm:hidden" />
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate max-w-[80px] sm:max-w-none">{product.internalCode}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate max-w-[80px] sm:max-w-none">{product.location}</span>
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {categoryLabels[product.category]}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

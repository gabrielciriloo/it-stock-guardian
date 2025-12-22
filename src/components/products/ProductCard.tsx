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
      <Card className="p-4 hover:shadow-card transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-border/50 bg-card animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <CategoryIcon category={product.category} className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-card-foreground truncate">{product.name}</h3>
              <StatusBadge status={product.status} />
            </div>
            
            <p className="text-sm text-muted-foreground mt-0.5">
              {product.brand} {product.model}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {product.internalCode}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {product.location}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {categoryLabels[product.category]}
              </span>
            </div>
          </div>
          
          <div className="text-right shrink-0">
            <span className="text-2xl font-bold text-primary">{product.quantity}</span>
            <p className="text-xs text-muted-foreground">em estoque</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

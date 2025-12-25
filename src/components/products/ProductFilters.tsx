import { ProductCategory, ProductStatus, categoryLabels, statusLabels } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  category: ProductCategory | 'all';
  status: ProductStatus | 'all';
  location: string;
  locations: string[];
  onCategoryChange: (value: ProductCategory | 'all') => void;
  onStatusChange: (value: ProductStatus | 'all') => void;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  category,
  status,
  location,
  locations,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
  onClearFilters,
}: ProductFiltersProps) {
  const hasFilters = category !== 'all' || status !== 'all' || location !== 'all';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1 ml-auto">
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Limpar</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Select value={category} onValueChange={(v) => onCategoryChange(v as ProductCategory | 'all')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            {(Object.entries(categoryLabels) as [ProductCategory, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => onStatusChange(v as ProductStatus | 'all')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            {(Object.entries(statusLabels) as [ProductStatus, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={onLocationChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Localizações</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

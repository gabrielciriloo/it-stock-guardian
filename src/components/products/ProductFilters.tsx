import { ProductCategory, ProductStatus, categoryLabels, statusLabels } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X, ArrowUpDown } from 'lucide-react';

export type SortOrder = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'quantity-asc' | 'quantity-desc' | 'brand-asc' | 'brand-desc';

interface ProductFiltersProps {
  category: ProductCategory | 'all';
  status: ProductStatus | 'all';
  location: string;
  locations: string[];
  sortOrder: SortOrder;
  onCategoryChange: (value: ProductCategory | 'all') => void;
  onStatusChange: (value: ProductStatus | 'all') => void;
  onLocationChange: (value: string) => void;
  onSortChange: (value: SortOrder) => void;
  onClearFilters: () => void;
}

const sortLabels: Record<SortOrder, string> = {
  'name-asc': 'Nome (A-Z)',
  'name-desc': 'Nome (Z-A)',
  'date-asc': 'Data (Mais antigos)',
  'date-desc': 'Data (Mais recentes)',
  'quantity-asc': 'Quantidade (Menor)',
  'quantity-desc': 'Quantidade (Maior)',
  'brand-asc': 'Marca (A-Z)',
  'brand-desc': 'Marca (Z-A)',
};

export function ProductFilters({
  category,
  status,
  location,
  locations,
  sortOrder,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
  onSortChange,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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

        <Select value={sortOrder} onValueChange={(v) => onSortChange(v as SortOrder)}>
          <SelectTrigger className="w-full">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(sortLabels) as [SortOrder, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

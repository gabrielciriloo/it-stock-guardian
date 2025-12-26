import { useState, useMemo } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { SearchBar } from '@/components/products/SearchBar';
import { ProductFilters, SortOrder } from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Package } from 'lucide-react';
import { ProductCategory, ProductStatus } from '@/types/inventory';

export default function Products() {
  const { products } = useInventory();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');

  const locations = useMemo(() => {
    return [...new Set(products.map(p => p.location))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.internalCode.toLowerCase().includes(searchLower) ||
          product.serialNumber.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.model.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && product.status !== statusFilter) return false;

      // Location filter
      if (locationFilter !== 'all' && product.location !== locationFilter) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'quantity-asc':
          return a.quantity - b.quantity;
        case 'quantity-desc':
          return b.quantity - a.quantity;
        case 'brand-asc':
          return a.brand.localeCompare(b.brand);
        case 'brand-desc':
          return b.brand.localeCompare(a.brand);
        default:
          return 0;
      }
    });

    return result;
  }, [products, search, categoryFilter, statusFilter, locationFilter, sortOrder]);

  const clearFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setLocationFilter('all');
    setSearch('');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} de {products.length} produtos
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button asChild>
              <Link to="/products/new">
                <PlusCircle className="w-5 h-5" />
                Novo Produto
              </Link>
            </Button>
          )}
        </div>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Filters */}
        <ProductFilters
          category={categoryFilter}
          status={statusFilter}
          location={locationFilter}
          locations={locations}
          sortOrder={sortOrder}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
          onLocationChange={setLocationFilter}
          onSortChange={setSortOrder}
          onClearFilters={clearFilters}
        />

        {/* Products List */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mt-1">
              Tente ajustar os filtros ou a busca
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

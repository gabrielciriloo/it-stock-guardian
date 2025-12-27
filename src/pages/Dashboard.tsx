import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProductCard } from '@/components/products/ProductCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ArrowRight,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { categoryLabels } from '@/types/inventory';

export default function Dashboard() {
  const { products, movements, isLoading } = useInventory();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </MainLayout>
    );
  }

  const stats = {
    total: products.length,
    available: products.filter(p => p.status === 'available').length,
    inUse: products.filter(p => p.status === 'in-use').length,
    maintenance: products.filter(p => p.status === 'maintenance').length,
  };

  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.quantity;
    return acc;
  }, {} as Record<string, number>);

  const recentProducts = [...products]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const recentMovements = movements.slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do estoque de TI do hospital
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Itens"
            value={totalQuantity}
            icon={<Package className="w-6 h-6" />}
            description={`${stats.total} produtos cadastrados`}
            variant="primary"
          />
          <StatCard
            title="Disponíveis"
            value={stats.available}
            icon={<CheckCircle2 className="w-6 h-6" />}
            variant="success"
          />
          <StatCard
            title="Em Uso"
            value={stats.inUse}
            icon={<Activity className="w-6 h-6" />}
            variant="info"
          />
          <StatCard
            title="Em Manutenção"
            value={stats.maintenance}
            icon={<Wrench className="w-6 h-6" />}
            variant="warning"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Categories Overview */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-card-foreground">Por Categoria</h2>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(count / totalQuantity) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Recent Products */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-card-foreground">Atualizados Recentemente</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/products" className="gap-1">
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {recentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Movements */}
        {recentMovements.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-card-foreground">Movimentações Recentes</h2>
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {recentMovements.map(movement => {
                const product = products.find(p => p.id === movement.productId);
                return (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {product?.name || 'Produto removido'}
                      </p>
                      <p className="text-xs text-muted-foreground">{movement.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {movement.createdAt.toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground">{movement.performedBy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

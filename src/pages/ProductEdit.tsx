import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductForm } from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct, addMovement } = useInventory();
  const { toast } = useToast();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Produto não encontrado</h3>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4" />
              Voltar aos produtos
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = (data: any) => {
    const oldStatus = product.status;
    const oldLocation = product.location;

    updateProduct(product.id, {
      ...data,
      serialNumber: data.serialNumber || '',
      observations: data.observations || '',
    });

    // Register movements if status or location changed
    if (data.status !== oldStatus) {
      addMovement({
        productId: product.id,
        type: 'status-change',
        description: `Status alterado`,
        previousStatus: oldStatus,
        newStatus: data.status,
        performedBy: 'Sistema',
      });
    }

    if (data.location !== oldLocation) {
      addMovement({
        productId: product.id,
        type: 'transfer',
        description: `Transferido para ${data.location}`,
        fromLocation: oldLocation,
        toLocation: data.location,
        performedBy: 'Sistema',
      });
    }

    toast({
      title: 'Produto atualizado!',
      description: 'As alterações foram salvas com sucesso.',
    });
    navigate(`/products/${product.id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/products/${product.id}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Editar Produto</h1>
            <p className="text-muted-foreground mt-0.5">
              {product.name}
            </p>
          </div>
        </div>

        <ProductForm initialData={product} onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}

import { useNavigate, Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductForm } from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductNew() {
  const navigate = useNavigate();
  const { addProduct } = useInventory();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    addProduct({
      ...data,
      serialNumber: data.serialNumber || '',
      observations: data.observations || '',
    });
    toast({
      title: 'Produto cadastrado!',
      description: 'O produto foi adicionado ao estoque com sucesso.',
    });
    navigate('/products');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/products">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Novo Produto</h1>
            <p className="text-muted-foreground mt-0.5">
              Preencha os dados para cadastrar um novo item no estoque
            </p>
          </div>
        </div>

        <ProductForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
}

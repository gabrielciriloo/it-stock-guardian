import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product, ProductCategory, ProductStatus, categoryLabels, statusLabels } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Save, Loader2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  category: z.enum(['computer', 'monitor', 'printer', 'peripheral', 'parts', 'cables', 'toner', 'network', 'other']),
  internalCode: z.string().min(1, 'Código interno é obrigatório'),
  serialNumber: z.string().optional(),
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  quantity: z.number().min(0, 'Quantidade deve ser positiva'),
  location: z.string().min(1, 'Localização é obrigatória'),
  status: z.enum(['available', 'in-use', 'maintenance', 'discarded']),
  observations: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

const defaultLocations = [
  'Almoxarifado Central',
  'Almoxarifado TI',
  'Sala de Servidores',
  'Setor Administrativo',
  'Recepção',
  'Bloco A',
  'Bloco B',
  'UTI',
  'Emergência',
];

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      category: initialData.category,
      internalCode: initialData.internalCode,
      serialNumber: initialData.serialNumber,
      brand: initialData.brand,
      model: initialData.model,
      quantity: initialData.quantity,
      location: initialData.location,
      status: initialData.status,
      observations: initialData.observations,
    } : {
      status: 'available',
      quantity: 1,
    },
  });

  const category = watch('category');
  const status = watch('status');
  const location = watch('location');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Dell OptiPlex 7090"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select value={category} onValueChange={(v) => setValue('category', v as ProductCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(categoryLabels) as [ProductCategory, string][]).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Marca *</Label>
            <Input
              id="brand"
              {...register('brand')}
              placeholder="Ex: Dell"
            />
            {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Modelo *</Label>
            <Input
              id="model"
              {...register('model')}
              placeholder="Ex: OptiPlex 7090"
            />
            {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Identificação</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="internalCode">Código Interno / Patrimônio *</Label>
            <Input
              id="internalCode"
              {...register('internalCode')}
              placeholder="Ex: TI-2024-001"
            />
            {errors.internalCode && <p className="text-sm text-destructive">{errors.internalCode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Número de Série</Label>
            <Input
              id="serialNumber"
              {...register('serialNumber')}
              placeholder="Ex: ABC123XYZ"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Estoque e Localização</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Localização *</Label>
            <Select value={location} onValueChange={(v) => setValue('location', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a localização" />
              </SelectTrigger>
              <SelectContent>
                {defaultLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Select value={status} onValueChange={(v) => setValue('status', v as ProductStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(statusLabels) as [ProductStatus, string][]).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Observações</h3>
        <Textarea
          {...register('observations')}
          placeholder="Informações adicionais sobre o produto..."
          rows={4}
        />
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {initialData ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </Button>
      </div>
    </form>
  );
}

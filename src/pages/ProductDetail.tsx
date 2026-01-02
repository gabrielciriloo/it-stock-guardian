import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/products/StatusBadge';
import { CategoryIcon } from '@/components/products/CategoryIcon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categoryLabels } from '@/types/inventory';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Hash,
  Tag,
  Calendar,
  Clock,
  History,
  ArrowRightLeft,
  Package,
  AlertCircle,
  Minus,
  Plus,
  Wrench,
  CheckCircle,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductMovements, deleteProduct, withdrawProduct, addUnitsToProduct, transferToMaintenance, returnFromMaintenance } = useInventory();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawQuantity, setWithdrawQuantity] = useState(1);
  const [withdrawDestination, setWithdrawDestination] = useState('');
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addQuantity, setAddQuantity] = useState(1);
  const [addOrigin, setAddOrigin] = useState('');

  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [maintenanceReason, setMaintenanceReason] = useState('');

  const product = products.find(p => p.id === id);
  const movements = product ? getProductMovements(product.id) : [];

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">Produto não encontrado</h3>
          <p className="text-muted-foreground mt-1">
            O produto que você está procurando não existe ou foi removido.
          </p>
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

  const handleDelete = () => {
    deleteProduct(product.id);
    toast({
      title: 'Produto excluído',
      description: 'O produto foi removido com sucesso.',
    });
    navigate('/products');
  };

  const handleWithdraw = () => {
    if (!withdrawDestination.trim()) {
      toast({
        title: 'Destino obrigatório',
        description: 'Informe o destino da retirada.',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawQuantity <= 0 || withdrawQuantity > product.quantity) {
      toast({
        title: 'Quantidade inválida',
        description: 'A quantidade deve ser maior que 0 e menor ou igual ao estoque disponível.',
        variant: 'destructive',
      });
      return;
    }

    const success = withdrawProduct(product.id, withdrawQuantity, withdrawDestination.trim(), user?.name || 'Sistema');
    
    if (success) {
      toast({
        title: 'Retirada realizada',
        description: `${withdrawQuantity} unidade(s) retirada(s) para ${withdrawDestination}.`,
      });
      setWithdrawDialogOpen(false);
      setWithdrawQuantity(1);
      setWithdrawDestination('');
    } else {
      toast({
        title: 'Erro na retirada',
        description: 'Não foi possível realizar a retirada.',
        variant: 'destructive',
      });
    }
  };

  const handleAddUnits = () => {
    if (!addOrigin.trim()) {
      toast({
        title: 'Origem obrigatória',
        description: 'Informe a origem dos novos equipamentos.',
        variant: 'destructive',
      });
      return;
    }

    if (addQuantity <= 0) {
      toast({
        title: 'Quantidade inválida',
        description: 'A quantidade deve ser maior que 0.',
        variant: 'destructive',
      });
      return;
    }

    const success = addUnitsToProduct(product.id, addQuantity, addOrigin.trim(), user?.name || 'Sistema');
    
    if (success) {
      toast({
        title: 'Unidades adicionadas',
        description: `${addQuantity} unidade(s) adicionada(s) ao estoque.`,
      });
      setAddDialogOpen(false);
      setAddQuantity(1);
      setAddOrigin('');
    } else {
      toast({
        title: 'Erro ao adicionar',
        description: 'Não foi possível adicionar as unidades.',
        variant: 'destructive',
      });
    }
  };

  const handleTransferToMaintenance = () => {
    if (!maintenanceReason.trim()) {
      toast({
        title: 'Motivo obrigatório',
        description: 'Informe o motivo da manutenção.',
        variant: 'destructive',
      });
      return;
    }

    const success = transferToMaintenance(product.id, maintenanceReason.trim(), user?.name || 'Sistema');
    
    if (success) {
      toast({
        title: 'Transferido para manutenção',
        description: `${product.name} foi enviado para manutenção.`,
      });
      setMaintenanceDialogOpen(false);
      setMaintenanceReason('');
    }
  };

  const handleReturnFromMaintenance = () => {
    const success = returnFromMaintenance(product.id, user?.name || 'Sistema');
    
    if (success) {
      toast({
        title: 'Equipamento retornado',
        description: `${product.name} está disponível novamente.`,
      });
    }
  };

  const movementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    entry: Package,
    exit: Package,
    transfer: ArrowRightLeft,
    'status-change': AlertCircle,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/products">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground mt-0.5">
                {product.brand} {product.model}
              </p>
            </div>
          </div>
          {user?.role === 'admin' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to={`/products/${product.id}/edit`}>
                  <Edit className="w-4 h-4" />
                  Editar
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O produto será permanentemente removido do sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - moves to top on mobile */}
          <div className="space-y-4 lg:order-2">
            <Card className="p-4 sm:p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Resumo</h3>
              <div className="text-center mb-4">
                <span className="text-4xl sm:text-5xl font-bold text-primary">{product.quantity}</span>
                <p className="text-sm text-muted-foreground mt-1">unidades em estoque</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4" />
                      Adicionar ao Estoque
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mx-4 sm:mx-0 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Adicionar ao Estoque</DialogTitle>
                      <DialogDescription>
                        Informe a quantidade e a origem das novas unidades de {product.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="addQuantity">Quantidade</Label>
                        <Input
                          id="addQuantity"
                          type="number"
                          min={1}
                          value={addQuantity}
                          onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origem</Label>
                        <Input
                          id="origin"
                          placeholder="Ex: Compra, Doação, Transferência de outra unidade..."
                          value={addOrigin}
                          onChange={(e) => setAddOrigin(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                      <Button onClick={handleAddUnits} className="w-full sm:w-auto">
                        Confirmar Entrada
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {product.quantity > 0 && (
                  <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <Minus className="w-4 h-4" />
                        Retirar do Estoque
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mx-4 sm:mx-0 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Retirar do Estoque</DialogTitle>
                        <DialogDescription>
                          Informe a quantidade e o destino da retirada de {product.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantidade</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min={1}
                            max={product.quantity}
                            value={withdrawQuantity}
                            onChange={(e) => setWithdrawQuantity(parseInt(e.target.value) || 1)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Disponível: {product.quantity} unidade(s)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination">Destino</Label>
                          <Input
                            id="destination"
                            placeholder="Ex: Setor de Radiologia, UTI, Recepção..."
                            value={withdrawDestination}
                            onChange={(e) => setWithdrawDestination(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)} className="w-full sm:w-auto">
                          Cancelar
                        </Button>
                        <Button onClick={handleWithdraw} className="w-full sm:w-auto">
                          Confirmar Retirada
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Maintenance buttons */}
                {product.status !== 'maintenance' && product.status !== 'discarded' && (
                  <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700">
                        <Wrench className="w-4 h-4" />
                        Enviar para Manutenção
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mx-4 sm:mx-0 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Transferir para Manutenção</DialogTitle>
                        <DialogDescription>
                          Informe o motivo pelo qual {product.name} está sendo enviado para manutenção.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="maintenanceReason">Motivo da manutenção</Label>
                          <Input
                            id="maintenanceReason"
                            placeholder="Ex: Defeito no display, impressora não liga, teclado quebrado..."
                            value={maintenanceReason}
                            onChange={(e) => setMaintenanceReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setMaintenanceDialogOpen(false)} className="w-full sm:w-auto">
                          Cancelar
                        </Button>
                        <Button onClick={handleTransferToMaintenance} className="w-full sm:w-auto">
                          <Wrench className="w-4 h-4" />
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {product.status === 'maintenance' && (
                  <Button 
                    className="w-full text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700" 
                    variant="outline"
                    onClick={handleReturnFromMaintenance}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Retornar da Manutenção
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Detalhes do Produto</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Marca</dt>
                  <dd className="font-medium">{product.brand}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Modelo</dt>
                  <dd className="font-medium">{product.model}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Categoria</dt>
                  <dd className="font-medium">{categoryLabels[product.category]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd><StatusBadge status={product.status} /></dd>
                </div>
              </dl>
            </Card>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:order-1">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <CategoryIcon category={product.category} className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <StatusBadge status={product.status} />
                    <span className="text-sm text-muted-foreground">
                      {categoryLabels[product.category]}
                    </span>
                  </div>
                  
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Código:</span>
                      <span className="font-medium truncate">{product.internalCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Série:</span>
                      <span className="font-medium truncate">{product.serialNumber || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Local:</span>
                      <span className="font-medium truncate">{product.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span className="font-medium text-primary text-lg">{product.quantity}</span>
                    </div>
                    {product.storageAddress && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Endereço:</span>
                        <span className="font-medium truncate">{product.storageAddress}</span>
                      </div>
                    )}
                    {product.storagePosition && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Posição:</span>
                        <span className="font-medium truncate">{product.storagePosition}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {product.observations && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-2">Observações</h3>
                  <p className="text-sm text-muted-foreground">{product.observations}</p>
                </div>
              )}

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Criado em: {product.createdAt.toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Atualizado em: {product.updatedAt.toLocaleDateString('pt-BR')}
                </div>
              </div>
            </Card>

            {/* History */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-base sm:text-lg font-semibold text-card-foreground">Histórico de Movimentações</h2>
              </div>

              {movements.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {movements.map(movement => {
                    const Icon = movementIcons[movement.type] || AlertCircle;
                    return (
                      <div key={movement.id} className="flex gap-3 pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground">{movement.description}</p>
                          {movement.fromLocation && movement.toLocation && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {movement.fromLocation} → {movement.toLocation}
                            </p>
                          )}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{movement.createdAt.toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{movement.performedBy}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 sm:py-8">
                  Nenhuma movimentação registrada
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

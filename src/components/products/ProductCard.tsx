import { useState } from 'react';
import { Product, categoryLabels } from '@/types/inventory';
import { Card } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { MapPin, Hash, Tag, Wrench, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { transferToMaintenance, returnFromMaintenance } = useInventory();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTransferToMaintenance = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMaintenanceDialogOpen(true);
  };

  const handleReturnFromMaintenance = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = returnFromMaintenance(product.id, user?.name || 'Usuário');
    if (success) {
      toast({
        title: 'Equipamento retornado',
        description: `${product.name} está disponível novamente.`,
      });
    }
  };

  const confirmTransferToMaintenance = () => {
    if (!reason.trim()) {
      toast({
        title: 'Erro',
        description: 'Informe o motivo da manutenção.',
        variant: 'destructive',
      });
      return;
    }

    const success = transferToMaintenance(product.id, reason, user?.name || 'Usuário');
    if (success) {
      toast({
        title: 'Transferido para manutenção',
        description: `${product.name} foi enviado para manutenção.`,
      });
      setMaintenanceDialogOpen(false);
      setReason('');
    }
  };

  return (
    <>
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

              {/* Maintenance action buttons */}
              <div className="flex gap-2 mt-3">
                {product.status !== 'maintenance' && product.status !== 'discarded' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 gap-1 text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    onClick={handleTransferToMaintenance}
                  >
                    <Wrench className="w-3 h-3" />
                    Manutenção
                  </Button>
                )}
                {product.status === 'maintenance' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 gap-1 text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                    onClick={handleReturnFromMaintenance}
                  >
                    <CheckCircle className="w-3 h-3" />
                    Retornar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>

      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferir para Manutenção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Produto: <strong>{product.name}</strong>
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo da manutenção *</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Defeito no display, impressora não liga, teclado com teclas quebradas..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaintenanceDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmTransferToMaintenance} className="gap-1">
              <Wrench className="w-4 h-4" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

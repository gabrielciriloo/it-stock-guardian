export type ProductStatus = 'available' | 'in-use' | 'maintenance' | 'discarded';

export type ProductCategory = 
  | 'computer'
  | 'monitor'
  | 'printer'
  | 'peripheral'
  | 'parts'
  | 'cables'
  | 'toner'
  | 'network'
  | 'other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  internalCode: string;
  serialNumber: string;
  brand: string;
  model: string;
  quantity: number;
  alarmQuantity?: number | null;
  location: string;
  storageAddress: string;
  storagePosition: string;
  status: ProductStatus;
  observations: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductMovement {
  id: string;
  productId: string;
  type: 'entry' | 'exit' | 'transfer' | 'status-change';
  description: string;
  fromLocation?: string;
  toLocation?: string;
  quantity?: number;
  previousStatus?: ProductStatus;
  newStatus?: ProductStatus;
  performedBy: string;
  createdAt: Date;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const categoryLabels: Record<ProductCategory, string> = {
  computer: 'Computador',
  monitor: 'Monitor',
  printer: 'Impressora',
  peripheral: 'Periférico',
  parts: 'Peças',
  cables: 'Cabos',
  toner: 'Toner/Cartucho',
  network: 'Rede',
  other: 'Outros',
};

export const statusLabels: Record<ProductStatus, string> = {
  available: 'Disponível',
  'in-use': 'Em Uso',
  maintenance: 'Manutenção',
  discarded: 'Descartado',
};

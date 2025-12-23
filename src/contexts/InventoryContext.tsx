import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductMovement, ProductStatus } from '@/types/inventory';

interface InventoryContextType {
  products: Product[];
  movements: ProductMovement[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMovement: (movement: Omit<ProductMovement, 'id' | 'createdAt'>) => void;
  getProductMovements: (productId: string) => ProductMovement[];
  withdrawProduct: (productId: string, quantity: number, destination: string, performedBy: string) => boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Initial sample data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Dell OptiPlex 7090',
    category: 'computer',
    internalCode: 'TI-2024-001',
    serialNumber: 'DELL7090X123',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    quantity: 5,
    location: 'Almoxarifado Central',
    status: 'available',
    observations: 'Lote recebido em janeiro/2024',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Monitor LG 24"',
    category: 'monitor',
    internalCode: 'TI-2024-002',
    serialNumber: 'LG24MK430H',
    brand: 'LG',
    model: '24MK430H',
    quantity: 12,
    location: 'Almoxarifado Central',
    status: 'available',
    observations: '',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Impressora HP LaserJet Pro',
    category: 'printer',
    internalCode: 'TI-2023-089',
    serialNumber: 'HPLJ4015DN',
    brand: 'HP',
    model: 'LaserJet Pro M404dn',
    quantity: 1,
    location: 'Setor Administrativo',
    status: 'in-use',
    observations: 'Instalada na recepção principal',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    name: 'Teclado USB Logitech',
    category: 'peripheral',
    internalCode: 'TI-2024-015',
    serialNumber: 'LOGK120-BATCH',
    brand: 'Logitech',
    model: 'K120',
    quantity: 25,
    location: 'Almoxarifado TI',
    status: 'available',
    observations: 'Estoque de reposição',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    name: 'Switch Cisco 24 portas',
    category: 'network',
    internalCode: 'TI-2022-045',
    serialNumber: 'CISCO2960X',
    brand: 'Cisco',
    model: 'Catalyst 2960-X',
    quantity: 1,
    location: 'Sala de Servidores',
    status: 'in-use',
    observations: 'Switch principal do bloco B',
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '6',
    name: 'Notebook Lenovo ThinkPad',
    category: 'computer',
    internalCode: 'TI-2023-067',
    serialNumber: 'LENOVOT14S',
    brand: 'Lenovo',
    model: 'ThinkPad T14s',
    quantity: 1,
    location: 'Assistência Técnica Externa',
    status: 'maintenance',
    observations: 'Enviado para troca de tela - previsão 15 dias',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-02-10'),
  },
];

const initialMovements: ProductMovement[] = [
  {
    id: '1',
    productId: '3',
    type: 'transfer',
    description: 'Transferência para Setor Administrativo',
    fromLocation: 'Almoxarifado Central',
    toLocation: 'Setor Administrativo',
    performedBy: 'João Silva',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    productId: '6',
    type: 'status-change',
    description: 'Enviado para manutenção externa',
    previousStatus: 'in-use',
    newStatus: 'maintenance',
    performedBy: 'Maria Santos',
    createdAt: new Date('2024-02-10'),
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<ProductMovement[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory_products');
    const savedMovements = localStorage.getItem('inventory_movements');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
        return value;
      }));
    } else {
      setProducts(initialProducts);
    }

    if (savedMovements) {
      setMovements(JSON.parse(savedMovements, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      }));
    } else {
      setMovements(initialMovements);
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('inventory_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (movements.length > 0) {
      localStorage.setItem('inventory_movements', JSON.stringify(movements));
    }
  }, [movements]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
    
    addMovement({
      productId: newProduct.id,
      type: 'entry',
      description: `Produto cadastrado no sistema`,
      quantity: product.quantity,
      performedBy: 'Sistema',
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addMovement = (movement: Omit<ProductMovement, 'id' | 'createdAt'>) => {
    const newMovement: ProductMovement = {
      ...movement,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setMovements(prev => [...prev, newMovement]);
  };

  const getProductMovements = (productId: string) => {
    return movements.filter(m => m.productId === productId).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  };

  const withdrawProduct = (productId: string, quantity: number, destination: string, performedBy: string): boolean => {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity < quantity || quantity <= 0) {
      return false;
    }

    const newQuantity = product.quantity - quantity;
    updateProduct(productId, { quantity: newQuantity });

    addMovement({
      productId,
      type: 'exit',
      description: `Retirada de ${quantity} unidade(s) para ${destination}`,
      quantity,
      toLocation: destination,
      fromLocation: product.location,
      performedBy,
    });

    return true;
  };

  return (
    <InventoryContext.Provider value={{
      products,
      movements,
      addProduct,
      updateProduct,
      deleteProduct,
      addMovement,
      getProductMovements,
      withdrawProduct,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}

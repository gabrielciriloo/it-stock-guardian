import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/inventory';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  deleteUser: (userId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredUser extends User {
  password: string;
}

const defaultUsers: StoredUser[] = [
  { id: '1', name: 'Administrador', email: 'admin@hospital.com', role: 'admin', password: 'admin123' },
  { id: '2', name: 'Usuário TI', email: 'user@hospital.com', role: 'user', password: 'user123' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load users and current user from localStorage
    const savedUsers = localStorage.getItem('inventory_users');
    const savedUser = localStorage.getItem('inventory_user');
    
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch {
        setUsers(defaultUsers);
        localStorage.setItem('inventory_users', JSON.stringify(defaultUsers));
      }
    } else {
      setUsers(defaultUsers);
      localStorage.setItem('inventory_users', JSON.stringify(defaultUsers));
    }
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
        localStorage.removeItem('inventory_user');
      }
    }
    
    // Mark loading as complete
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('inventory_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventory_user');
  };

  const createUser = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      password,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('inventory_users', JSON.stringify(updatedUsers));
    return true;
  };

  const deleteUser = (userId: string) => {
    if (userId === user?.id) return; // Can't delete yourself
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('inventory_users', JSON.stringify(updatedUsers));
  };

  const publicUsers = users.map(({ password, ...u }) => u);

  // Don't render children until loading is complete
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, users: publicUsers, login, logout, createUser, deleteUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserPlus, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole, User } from '@/types/inventory';

export default function Users() {
  const { user, users, createUser, deleteUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (newUserPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    const success = await createUser(newUserName, newUserEmail, newUserPassword, newUserRole);
    
    if (success) {
      toast.success('Usuário criado com sucesso!');
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('user');
      setIsDialogOpen(false);
    } else {
      toast.error('Já existe um usuário com este e-mail');
    }
    
    setIsLoading(false);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      toast.success(`Usuário "${userToDelete.name}" removido com sucesso`);
      setUserToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">Adicione ou remova usuários do sistema</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar um novo usuário no sistema.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Nome do usuário"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@hospital.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Perfil de Acesso</Label>
                  <Select value={newUserRole} onValueChange={(value: UserRole) => setNewUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar Usuário'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
            <CardDescription>
              Total de {users.length} usuário(s) no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {u.role === 'admin' ? (
                          <Shield className="h-4 w-4 text-primary" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        {u.name}
                        {u.id === user?.id && (
                          <Badge variant="outline" className="ml-2">Você</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                        {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {u.id !== user?.id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => setUserToDelete(u)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* AlertDialog controlado fora da tabela */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o usuário "{userToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

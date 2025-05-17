'use client';

import type React from 'react';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
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

export function SecurityTab() {
	const { changePassword, user } = useAuth();
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validate password match
		if (newPassword !== confirmPassword) {
			toast({
				title: 'Erro',
				description: 'As novas senhas não coincidem',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		// Validate password strength
		if (newPassword.length < 8) {
			toast({
				title: 'Erro',
				description: 'A senha deve ter pelo menos 8 caracteres',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		try {
			const { error, success } = await changePassword(currentPassword, newPassword);

			if (error) {
				toast({
					title: 'Erro',
					description: error,
					variant: 'destructive',
				});
			} else if (success) {
				toast({
					title: 'Sucesso',
					description: 'Senha atualizada com sucesso!',
				});
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			}
		} catch (err) {
			toast({
				title: 'Erro',
				description: 'Ocorreu um erro inesperado',
				variant: 'destructive',
			});
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		// This would be implemented with a call to your API
		toast({
			title: 'Não implementado',
			description: 'A funcionalidade de exclusão de conta ainda não foi implementada',
		});
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Alterar Senha</CardTitle>
					<CardDescription>Atualize a senha da sua conta</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleChangePassword}
						className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Senha Atual</Label>
							<Input
								id="currentPassword"
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="newPassword">Nova Senha</Label>
							<Input
								id="newPassword"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}>
							{isLoading ? 'Atualizando...' : 'Atualizar Senha'}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Excluir Conta</CardTitle>
					<CardDescription>Excluir permanentemente sua conta e todos os seus dados</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Once you delete your account, there is no going back. This action cannot be undone.
					</p>
				</CardContent>
				<CardFooter>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Excluir Conta</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
								<AlertDialogDescription>
									Esta ação não pode ser desfeita. Isso irá excluir permanentemente sua conta e remover seus dados dos
									nossos servidores.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteAccount}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
									Excluir Conta
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardFooter>
			</Card>
		</div>
	);
}

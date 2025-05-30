'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SignUpForm() {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		// Validate password match
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}

		// Validate password strength
		if (password.length < 8) {
			setError('Password must be at least 8 characters long');
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, name }),
			});

			if (response.ok) {
				setSuccess(true);
				router.refresh();
			} else {
				const data = await response.json();
				setError(data.error);
			}
		} catch (err) {
			setError('An unexpected error occurred');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Criar uma conta</h1>
				<p className="text-muted-foreground">Digite seus dados abaixo para criar sua conta</p>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="bg-green-50 text-green-800 border-green-200">
					<CheckCircle2 className="h-4 w-4 text-green-600" />
					<AlertDescription>Cadastro realizado com sucesso!</AlertDescription>
				</Alert>
			)}

			{!success && (
				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Nome</Label>
						<Input
							id="name"
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">E-mail</Label>
						<Input
							id="email"
							type="email"
							placeholder="nome@exemplo.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Senha</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmar Senha</Label>
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
						className="w-full"
						disabled={isLoading}>
						{isLoading ? 'Criando conta...' : 'Cadastrar'}
					</Button>
				</form>
			)}
		</div>
	);
}

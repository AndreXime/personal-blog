'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ForgotPasswordForm } from './forgot-password-form';

export function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [Tab, setTab] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				router.refresh();
			} else {
				const data = await response.json();
				setError(data.error);
			}
		} catch (err) {
			setError('Ocorreu um erro inesperado');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	if (Tab) {
		return <ForgotPasswordForm setTab={setTab} />;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Entrar</h1>
				<p className="text-muted-foreground">Digite seu e-mail e senha para entrar na sua conta</p>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<form
				onSubmit={handleSubmit}
				className="space-y-4">
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
					<div className="flex items-center justify-between">
						<Label htmlFor="password">Senha</Label>
						<button
							onClick={() => setTab(true)}
							className="text-sm text-primary hover:underline">
							Esqueceu a senha?
						</button>
					</div>
					<Input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading}>
					{isLoading ? 'Entrando...' : 'Entrar'}
				</Button>
			</form>
		</div>
	);
}

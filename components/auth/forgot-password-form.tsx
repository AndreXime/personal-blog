'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm({ setTab }: { setTab: React.Dispatch<React.SetStateAction<boolean>> }) {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				setSuccess(true);
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
				<h1 className="text-2xl font-bold">Esqueci a Senha</h1>
				<p className="text-muted-foreground">Digite seu e-mail para redefinir sua senha</p>
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
					<AlertDescription>
						E-mail de redefinição de senha enviado! Verifique sua caixa de entrada para mais instruções.
					</AlertDescription>
				</Alert>
			)}

			{!success && (
				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}>
						{isLoading ? 'Enviando e-mail de redefinição...' : 'Redefinir Senha'}
					</Button>
				</form>
			)}

			<div className="text-center text-sm">
				Lembrou sua senha?
				<button
					onClick={() => setTab(false)}
					className="text-primary hover:underline">
					Entrar
				</button>
			</div>
		</div>
	);
}

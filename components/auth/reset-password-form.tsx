'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ResetPasswordForm() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

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

		if (!token) {
			setError('Reset token is missing');
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error);
			} else {
				setSuccess(true);
				setTimeout(() => {
					router.push('/admin');
				}, 3000);
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
				<h1 className="text-2xl font-bold">Redefinir Senha</h1>
				<p className="text-muted-foreground">Digite sua nova senha</p>
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
						Senha redefinida com sucesso! Você será redirecionado para a página de login em breve.
					</AlertDescription>
				</Alert>
			)}

			{!success && (
				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">Nova Senha</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
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
						className="w-full"
						disabled={isLoading}>
						{isLoading ? 'Redefinindo senha...' : 'Redefinir Senha'}
					</Button>
				</form>
			)}
		</div>
	);
}

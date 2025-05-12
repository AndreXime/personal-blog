'use client';

import type React from 'react';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTab } from './tab-context';

export function ForgotPasswordForm() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const { resetPassword } = useAuth();
	const { setTab } = useTab();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { error, success } = await resetPassword(email);

			if (error) {
				setError(error);
			} else if (success) {
				setSuccess(true);
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
				<h1 className="text-2xl font-bold">Forgot Password</h1>
				<p className="text-muted-foreground">Enter your email to reset your password</p>
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
						Password reset email sent! Please check your inbox for further instructions.
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
						{isLoading ? 'Sending reset email...' : 'Reset Password'}
					</Button>
				</form>
			)}

			<div className="text-center text-sm">
				Remember your password?
				<button
					onClick={() => setTab('Login')}
					className="text-primary hover:underline">
					Sign in
				</button>
			</div>
		</div>
	);
}

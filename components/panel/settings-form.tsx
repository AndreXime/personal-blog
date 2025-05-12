'use client';

import type React from 'react';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsForm() {
	const { changePassword } = useAuth();
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		// Validate password match
		if (newPassword !== confirmPassword) {
			setError('New passwords do not match');
			setIsLoading(false);
			return;
		}

		// Validate password strength
		if (newPassword.length < 8) {
			setError('Password must be at least 8 characters long');
			setIsLoading(false);
			return;
		}

		try {
			const { error, success } = await changePassword(currentPassword, newPassword);

			if (error) {
				setError(error);
			} else if (success) {
				setSuccess(true);
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
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
			<h1 className="text-3xl font-bold mb-6">Account Settings</h1>

			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>Update your account password</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert
							variant="destructive"
							className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && (
						<Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							<AlertDescription>Password updated successfully!</AlertDescription>
						</Alert>
					)}

					<form
						onSubmit={handleChangePassword}
						className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Current Password</Label>
							<Input
								id="currentPassword"
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="newPassword">New Password</Label>
							<Input
								id="newPassword"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm New Password</Label>
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
							{isLoading ? 'Updating...' : 'Update Password'}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Delete Account</CardTitle>
					<CardDescription>Permanently delete your account and all your data</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Once you delete your account, there is no going back. This action cannot be undone.
					</p>
				</CardContent>
				<CardFooter>
					<Button variant="destructive">Delete Account</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

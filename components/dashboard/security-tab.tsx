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
				title: 'Error',
				description: 'New passwords do not match',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		// Validate password strength
		if (newPassword.length < 8) {
			toast({
				title: 'Error',
				description: 'Password must be at least 8 characters long',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		try {
			const { error, success } = await changePassword(currentPassword, newPassword);

			if (error) {
				toast({
					title: 'Error',
					description: error,
					variant: 'destructive',
				});
			} else if (success) {
				toast({
					title: 'Success',
					description: 'Password updated successfully!',
				});
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			}
		} catch (err) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
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
			title: 'Not implemented',
			description: 'Account deletion functionality is not yet implemented',
		});
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>Update your account password</CardDescription>
				</CardHeader>
				<CardContent>
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
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">Delete Account</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your account and remove your data from our
									servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteAccount}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
									Delete Account
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardFooter>
			</Card>
		</div>
	);
}

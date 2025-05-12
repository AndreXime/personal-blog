'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ProfileForm() {
	const { user, updateProfile } = useAuth();
	const [name, setName] = useState('');
	const [bio, setBio] = useState('');
	const [avatarUrl, setAvatarUrl] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setBio(user.bio || '');
			setAvatarUrl(user.avatarUrl || '');
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const { error, success } = await updateProfile({
				name,
				bio,
				avatarUrl,
			});

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
			<h1 className="text-3xl font-bold mb-6">Your Profile</h1>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="bg-green-50 text-green-800 border-green-200">
					<CheckCircle2 className="h-4 w-4 text-green-600" />
					<AlertDescription>Profile updated successfully!</AlertDescription>
				</Alert>
			)}

			<div className="flex items-center gap-4">
				<Avatar className="h-20 w-20">
					<AvatarImage src={avatarUrl || '/placeholder.svg?height=80&width=80'} />
					<AvatarFallback>{name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="text-xl font-semibold">{name || 'Anonymous'}</h2>
					<p className="text-muted-foreground">{user.email}</p>
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="avatarUrl">Avatar URL</Label>
					<Input
						id="avatarUrl"
						value={avatarUrl}
						onChange={(e) => setAvatarUrl(e.target.value)}
					/>
					<p className="text-xs text-muted-foreground">
						Enter a URL for your avatar image. You can use services like Gravatar or upload to an image hosting service.
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="bio">Bio</Label>
					<Textarea
						id="bio"
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						rows={4}
					/>
				</div>

				<Button
					type="submit"
					disabled={isLoading}>
					{isLoading ? 'Saving...' : 'Save Changes'}
				</Button>
			</form>
		</div>
	);
}

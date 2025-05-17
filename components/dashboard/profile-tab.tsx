'use client';

import type React from 'react';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

export function ProfileTab() {
	const { updateProfile, user } = useAuth();
	const [name, setName] = useState(user.name || '');
	const [bio, setBio] = useState(user.bio || '');
	const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
	const [jobTitle, setJobTitle] = useState(user.jobTitle || '');
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { error, success } = await updateProfile({
				name,
				jobTitle,
				bio,
				avatarUrl,
			});

			if (error) {
				toast({
					title: 'Erro',
					description: error,
					variant: 'destructive',
				});
			} else if (success) {
				toast({
					title: 'Sucesso',
					description: 'Perfil atualizado com sucesso!',
				});
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

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsUploading(true);
		const formData = new FormData();
		formData.append('avatar', file);
		try {
			const response = await fetch('/api/auth/user/avatar', { method: 'POST', body: formData });
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Error uploading avatar');
			}
			setAvatarUrl(data.avatarUrl);
			toast({
				title: 'Sucesso',
				description: 'Avatar enviado com sucesso!',
			});
		} catch {
			toast({
				title: 'Erro de envio',
				description: 'Falha ao enviar avatar',
				variant: 'destructive',
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Informações do Perfil</CardTitle>
				<CardDescription>Atualize suas informações pessoais</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4 mb-6">
					<label
						htmlFor="avatar"
						className="cursor-pointer">
						<Avatar className="h-24 w-24">
							<AvatarImage src={avatarUrl || '/placeholder.svg?height=80&width=80'} />
							<AvatarFallback>{name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</AvatarFallback>
							<input
								id="avatar"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleFileChange}
								disabled={isUploading}
							/>
						</Avatar>
					</label>
					<div>
						<h2 className="text-xl font-semibold">{name || 'Anônimo'}</h2>
						<p className="text-muted-foreground">{user.email}</p>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Nome</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="jobTitle">Cargo</Label>
						<Input
							id="jobTitle"
							value={jobTitle}
							onChange={(e) => setJobTitle(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">Biografia</Label>
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
						{isLoading ? 'Salvando...' : 'Salvar alterações'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

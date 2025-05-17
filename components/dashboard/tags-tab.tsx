'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
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

interface Tag {
	id: string;
	name: string;
	slug: string;
}

export function TagsTab() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);

	// Form state
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const response = await fetch('/api/tags');
				const data = await response.json();
				setTags(data.tags || []);
			} catch (error) {
				console.error('Error fetching tags:', error);
				toast({
					title: 'Error',
					description: 'Failed to load tags',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchTags();
	}, []);

	const resetForm = () => {
		setName('');
		setSlug('');
		setEditingTag(null);
	};

	const handleEditTag = (tag: Tag) => {
		setEditingTag(tag);
		setName(tag.name);
		setSlug(tag.slug);
		setShowForm(true);
	};

	const handleDeleteTag = async (tagId: string) => {
		try {
			const response = await fetch(`/api/tags/${tagId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setTags(tags.filter((tag) => tag.id !== tagId));
				toast({
					title: 'Success',
					description: 'Tag deleted successfully',
				});
			} else {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete tag');
			}
		} catch (error) {
			console.error('Error deleting tag:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete tag',
				variant: 'destructive',
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const tagData = {
				name,
				slug,
			};

			const url = editingTag ? `/api/tags/${editingTag.id}` : '/api/tags';

			const method = editingTag ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(tagData),
			});

			if (response.ok) {
				const data = await response.json();

				if (editingTag) {
					setTags(tags.map((tag) => (tag.id === editingTag.id ? data.tag : tag)));
				} else {
					setTags([...tags, data.tag]);
				}

				toast({
					title: 'Success',
					description: `Tag ${editingTag ? 'updated' : 'created'} successfully`,
				});

				resetForm();
				setShowForm(false);
			} else {
				const data = await response.json();
				throw new Error(data.error || `Failed to ${editingTag ? 'update' : 'create'} tag`);
			}
		} catch (error) {
			console.error('Error submitting tag:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : `Failed to ${editingTag ? 'update' : 'create'} tag`,
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Generate slug from name
	const generateSlug = () => {
		const generatedSlug = name
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();

		setSlug(generatedSlug);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold">Tags</h2>
				<Button
					onClick={() => {
						resetForm();
						setShowForm(true);
					}}>
					<Plus className="h-4 w-4 mr-2" />
					New Tag
				</Button>
			</div>

			{showForm && (
				<Card>
					<CardHeader>
						<CardTitle>{editingTag ? 'Edit Tag' : 'Create New Tag'}</CardTitle>
						<CardDescription>
							{editingTag ? 'Update your existing tag' : 'Fill in the details to create a new tag'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										onBlur={() => {
											if (!editingTag && !slug) {
												generateSlug();
											}
										}}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="slug">Slug</Label>
									<div className="flex space-x-2">
										<Input
											id="slug"
											value={slug}
											onChange={(e) => setSlug(e.target.value)}
											required
										/>
										<Button
											type="button"
											variant="outline"
											onClick={generateSlug}>
											Generate
										</Button>
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										resetForm();
										setShowForm(false);
									}}>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{editingTag ? 'Updating...' : 'Creating...'}
										</>
									) : editingTag ? (
										'Update Tag'
									) : (
										'Create Tag'
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{isLoading ? (
				<div className="flex justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : tags.length === 0 ? (
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-muted-foreground">You haven't created any tags yet.</p>
						<Button
							className="mt-4"
							onClick={() => setShowForm(true)}>
							Create your first tag
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{tags.map((tag) => (
						<Card key={tag.id}>
							<CardContent className="p-4">
								<div className="flex justify-between items-center">
									<div>
										<h3 className="font-medium">{tag.name}</h3>
										<p className="text-xs text-muted-foreground">/{tag.slug}</p>
									</div>
									<div className="flex space-x-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleEditTag(tag)}>
											<Pencil className="h-4 w-4" />
										</Button>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="text-destructive">
													<Trash2 className="h-4 w-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Are you sure?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete the tag "{tag.name}" and remove it from all associated posts.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleDeleteTag(tag.id)}
														className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

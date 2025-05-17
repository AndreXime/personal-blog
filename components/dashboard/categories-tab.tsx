'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface Category {
	id: string;
	name: string;
	slug: string;
	description: string | null;
}

export function CategoriesTab() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	// Form state
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [description, setDescription] = useState('');
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('/api/categories');
				const data = await response.json();
				setCategories(data.categories || []);
			} catch (error) {
				console.error('Error fetching categories:', error);
				toast({
					title: 'Error',
					description: 'Failed to load categories',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const resetForm = () => {
		setName('');
		setSlug('');
		setDescription('');
		setEditingCategory(null);
	};

	const handleEditCategory = (category: Category) => {
		setEditingCategory(category);
		setName(category.name);
		setSlug(category.slug);
		setDescription(category.description || '');
		setShowForm(true);
	};

	const handleDeleteCategory = async (categoryId: string) => {
		try {
			const response = await fetch(`/api/categories/${categoryId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setCategories(categories.filter((category) => category.id !== categoryId));
				toast({
					title: 'Success',
					description: 'Category deleted successfully',
				});
			} else {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete category');
			}
		} catch (error) {
			console.error('Error deleting category:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete category',
				variant: 'destructive',
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const categoryData = {
				name,
				slug,
				description,
			};

			const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';

			const method = editingCategory ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(categoryData),
			});

			if (response.ok) {
				const data = await response.json();

				if (editingCategory) {
					setCategories(categories.map((category) => (category.id === editingCategory.id ? data.category : category)));
				} else {
					setCategories([...categories, data.category]);
				}

				toast({
					title: 'Success',
					description: `Category ${editingCategory ? 'updated' : 'created'} successfully`,
				});

				resetForm();
				setShowForm(false);
			} else {
				const data = await response.json();
				throw new Error(data.error || `Failed to ${editingCategory ? 'update' : 'create'} category`);
			}
		} catch (error) {
			console.error('Error submitting category:', error);
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : `Failed to ${editingCategory ? 'update' : 'create'} category`,
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
				<h2 className="text-xl font-semibold">Categories</h2>
				<Button
					onClick={() => {
						resetForm();
						setShowForm(true);
					}}>
					<Plus className="h-4 w-4 mr-2" />
					New Category
				</Button>
			</div>

			{showForm && (
				<Card>
					<CardHeader>
						<CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
						<CardDescription>
							{editingCategory ? 'Update your existing category' : 'Fill in the details to create a new category'}
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
											if (!editingCategory && !slug) {
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

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={3}
								/>
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
											{editingCategory ? 'Updating...' : 'Creating...'}
										</>
									) : editingCategory ? (
										'Update Category'
									) : (
										'Create Category'
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
			) : categories.length === 0 ? (
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-muted-foreground">You haven't created any categories yet.</p>
						<Button
							className="mt-4"
							onClick={() => setShowForm(true)}>
							Create your first category
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{categories.map((category) => (
						<Card key={category.id}>
							<CardContent className="p-6">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold mb-1">{category.name}</h3>
										<p className="text-sm text-muted-foreground mb-2">/{category.slug}</p>
										{category.description && <p className="text-sm">{category.description}</p>}
									</div>
									<div className="flex space-x-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleEditCategory(category)}>
											<Pencil className="h-4 w-4" />
										</Button>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="outline"
													size="icon"
													className="text-destructive">
													<Trash2 className="h-4 w-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Are you sure?</AlertDialogTitle>
													<AlertDialogDescription>
														This will permanently delete the category "{category.name}" and remove it from all
														associated posts.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleDeleteCategory(category.id)}
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

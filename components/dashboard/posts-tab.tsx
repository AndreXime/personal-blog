'use client';

import { Textarea } from '@/components/ui/textarea';

import type React from 'react';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import type { PostWithRelations } from '@/lib/types';
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
import { MultiSelect } from '@/components/dashboard/multi-select';

const Editor = dynamic(() => import('@/components/dashboard/editor'), {
	ssr: false,
	loading: () => (
		<div className="h-96 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
		</div>
	),
});

export function PostsTab() {
	const [activeTab, setActiveTab] = useState('all-posts');
	const [posts, setPosts] = useState<PostWithRelations[]>([]);
	const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
	const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingPost, setEditingPost] = useState<PostWithRelations | null>(null);

	// Form state
	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [excerpt, setExcerpt] = useState('');
	const [content, setContent] = useState('');
	const [Image, setImage] = useState<File | null>(null);
	const [readingTime, setReadingTime] = useState(5);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch posts, categories, and tags
				const [postsRes, categoriesRes, tagsRes] = await Promise.all([
					fetch('/api/posts').then((res) => res.json()),
					fetch('/api/categories').then((res) => res.json()),
					fetch('/api/tags').then((res) => res.json()),
				]);
				console.log(postsRes,categoriesRes,tagsRes)
				setPosts(postsRes.posts || []);
				setCategories(categoriesRes.categories || []);
				setTags(tagsRes.tags || []);
			} catch (error) {
				console.error('Error fetching data:', error);
				toast({
					title: 'Error',
					description: 'Failed to load data',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const resetForm = () => {
		setTitle('');
		setSlug('');
		setExcerpt('');
		setContent('');
		setImage(null);
		setReadingTime(5);

		setSelectedCategories([]);
		setSelectedTags([]);
		setEditingPost(null);
	};

	const handleEditPost = (post: PostWithRelations) => {
		setEditingPost(post);
		setTitle(post.title);
		setSlug(post.slug);
		setExcerpt(post.excerpt || '');
		setContent(post.content);
		setImage(null);
		setReadingTime(post.readingTime);
		setSelectedCategories(post.categories.map((c) => c.id));
		setSelectedTags(post.tags.map((t) => t.id));
		setActiveTab('new-post');
	};

	const handleDeletePost = async (postId: string) => {
		try {
			const response = await fetch(`/api/posts/${postId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setPosts(posts.filter((post) => post.id !== postId));
				toast({
					title: 'Success',
					description: 'Post deleted successfully',
				});
			} else {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete post');
			}
		} catch (error) {
			console.error('Error deleting post:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete post',
				variant: 'destructive',
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('slug', slug);
			formData.append('excerpt', excerpt);
			formData.append('content', content);
			if (Image) {
				formData.append('image', Image, Image.name);
			}
			formData.append('readingTime', readingTime.toString());
			formData.append('categories', JSON.stringify(selectedCategories));
			formData.append('tags', JSON.stringify(selectedTags));

			const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
			const method = editingPost ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();

				if (editingPost) {
					setPosts(posts.map((post) => (post.id === editingPost.id ? data.post : post)));
				} else {
					setPosts([...posts, data.post]);
				}

				toast({
					title: 'Success',
					description: `Post ${editingPost ? 'updated' : 'created'} successfully`,
				});

				resetForm();
				setActiveTab('all-posts');
			} else {
				const data = await response.json();
				throw new Error(data.error || `Failed to ${editingPost ? 'update' : 'create'} post`);
			}
		} catch (error) {
			console.error('Error submitting post:', error);
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : `Failed to ${editingPost ? 'update' : 'create'} post`,
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Generate slug from title
	const generateSlug = () => {
		const generatedSlug = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();

		setSlug(generatedSlug);
	};

	return (
		<Tabs
			defaultValue="all-posts"
			value={activeTab}
			onValueChange={setActiveTab}
			className="w-full">
			<TabsList className="grid grid-cols-2 w-[400px] mb-8">
				<TabsTrigger value="all-posts">All Posts</TabsTrigger>
				<TabsTrigger value="new-post">{editingPost ? 'Edit Post' : 'New Post'}</TabsTrigger>
			</TabsList>

			<TabsContent
				value="all-posts"
				className="space-y-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Your Posts</h2>
					<Button
						onClick={() => {
							resetForm();
							setActiveTab('new-post');
						}}>
						<Plus className="h-4 w-4 mr-2" />
						New Post
					</Button>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : posts.length === 0 ? (
					<Card>
						<CardContent className="py-8 text-center">
							<p className="text-muted-foreground">You haven't created any posts yet.</p>
							<Button
								className="mt-4"
								onClick={() => setActiveTab('new-post')}>
								Create your first post
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{posts.map((post) => (
							<Card key={post.id}>
								<CardContent className="p-6">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-semibold mb-2">{post.title}</h3>
											<div className="flex items-center text-sm text-muted-foreground mb-2">
												<span
													className={`mr-3 px-2 py-1 rounded-full text-xs ${
														post.published
															? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
															: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
													}`}>
													{post.published ? 'Published' : 'Draft'}
												</span>
												<span>{new Date(post.createdAt).toLocaleDateString()}</span>
											</div>
											<p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
										</div>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleEditPost(post)}>
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
															This will permanently delete the post "{post.title}".
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleDeletePost(post.id)}
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
			</TabsContent>

			<TabsContent
				value="new-post"
				className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
						<CardDescription>
							{editingPost ? 'Update your existing post' : 'Fill in the details to create a new blog post'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										onBlur={() => {
											if (!editingPost && !slug) {
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
								<Label htmlFor="excerpt">Excerpt</Label>
								<Textarea
									id="excerpt"
									value={excerpt}
									onChange={(e) => setExcerpt(e.target.value)}
									rows={3}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="content">Content</Label>
								<Editor
									initialValue={content}
									onChange={setContent}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label htmlFor="image">Cover Image</Label>
									<Input
										id="image"
										type="file"
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0] ?? null)}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="readingTime">Reading Time (minutes)</Label>
									<Input
										id="readingTime"
										type="number"
										min="1"
										value={readingTime}
										onChange={(e) => setReadingTime(Number(e.target.valueAsNumber || 0))}
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<Label>Categories</Label>
									<MultiSelect
										options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
										selected={selectedCategories}
										onChange={setSelectedCategories}
										placeholder="Select categories"
									/>
								</div>

								<div className="space-y-4">
									<Label>Tags</Label>
									<MultiSelect
										options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
										selected={selectedTags}
										onChange={setSelectedTags}
										placeholder="Select tags"
									/>
								</div>
							</div>

							<div className="flex justify-end space-x-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										resetForm();
										setActiveTab('all-posts');
									}}>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{editingPost ? 'Updating...' : 'Creating...'}
										</>
									) : editingPost ? (
										'Update Post'
									) : (
										'Create Post'
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}

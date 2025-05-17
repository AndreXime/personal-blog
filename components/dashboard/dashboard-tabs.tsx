'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/dashboard/profile-tab';
import { SecurityTab } from '@/components/dashboard/security-tab';
import { PostsTab } from '@/components/dashboard/posts-tab';
import { CategoriesTab } from '@/components/dashboard/categories-tab';
import { TagsTab } from '@/components/dashboard/tags-tab';

export function DashboardTabs() {
	const [activeTab, setActiveTab] = useState('profile');

	return (
		<Tabs
			defaultValue="profile"
			value={activeTab}
			onValueChange={setActiveTab}
			className="w-full">
			<TabsList className="grid grid-cols-5 mb-8">
				<TabsTrigger value="profile">Profile</TabsTrigger>
				<TabsTrigger value="security">Security</TabsTrigger>
				<TabsTrigger value="posts">Posts</TabsTrigger>
				<TabsTrigger value="categories">Categories</TabsTrigger>
				<TabsTrigger value="tags">Tags</TabsTrigger>
			</TabsList>

			<TabsContent
				value="profile"
				className="space-y-4">
				<ProfileTab />
			</TabsContent>

			<TabsContent
				value="security"
				className="space-y-4">
				<SecurityTab />
			</TabsContent>

			<TabsContent
				value="posts"
				className="space-y-4">
				<PostsTab />
			</TabsContent>

			<TabsContent
				value="categories"
				className="space-y-4">
				<CategoriesTab />
			</TabsContent>

			<TabsContent
				value="tags"
				className="space-y-4">
				<TagsTab />
			</TabsContent>
		</Tabs>
	);
}

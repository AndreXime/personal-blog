'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryFilterProps {
	categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
	const [selectedCategory, setSelectedCategory] = useState('all');

	return (
		<div className="flex flex-wrap gap-2">
			<Link
				href="/blog"
				className={`px-4 py-2 rounded-full text-sm transition-colors ${
					selectedCategory === 'all'
						? 'bg-primary text-primary-foreground'
						: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground'
				}`}
				onClick={() => setSelectedCategory('all')}>
				All
			</Link>

			{categories.map((category) => (
				<Link
					key={category.id}
					href={`/category/${category.slug}`}
					className={`px-4 py-2 rounded-full text-sm transition-colors ${
						selectedCategory === category.slug
							? 'bg-primary text-primary-foreground'
							: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground'
					}`}
					onClick={() => setSelectedCategory(category.slug)}>
					{category.name}
				</Link>
			))}
		</div>
	);
}

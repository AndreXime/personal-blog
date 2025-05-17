'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
	initialQuery?: string;
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<form
			onSubmit={handleSearch}
			className="relative w-full max-w-sm">
			<input
				type="text"
				placeholder="Procurar posts..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
			/>
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
		</form>
	);
}

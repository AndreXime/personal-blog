'use client';

import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ShareButtonsProps {
	title: string;
	slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
	const url = `${baseUrl}/blog/${slug}`;

	const handleCopyLink = () => {
		navigator.clipboard.writeText(url);
		toast({
			title: 'Link copied',
			description: 'The link has been copied to your clipboard',
		});
	};

	const shareOnTwitter = () => {
		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
			'_blank'
		);
	};

	const shareOnFacebook = () => {
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
	};

	const shareOnLinkedIn = () => {
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
	};

	return (
		<div className="flex flex-col sm:flex-row items-center gap-4">
			<span className="text-sm font-medium">Compartilhe esse post:</span>

			<div className="flex gap-2">
				<Button
					variant="outline"
					size="icon"
					onClick={shareOnTwitter}
					aria-label="Share on Twitter">
					<Twitter className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="icon"
					onClick={shareOnFacebook}
					aria-label="Share on Facebook">
					<Facebook className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="icon"
					onClick={shareOnLinkedIn}
					aria-label="Share on LinkedIn">
					<Linkedin className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="icon"
					onClick={handleCopyLink}
					aria-label="Copy link">
					<Link2 className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

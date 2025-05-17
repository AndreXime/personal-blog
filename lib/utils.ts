import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { marked } from 'marked';
import TurndownService from 'turndown';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string | unknown {
	if (typeof error === 'object' && error !== null && 'message' in error) {
		return String((error as { message: unknown }).message);
	}
	return error;
}

export const convertMarkdownToHtml = async (markdown: string) => {
	return await marked(markdown);
};

const turndownService = new TurndownService();

export const convertHtmlToMarkdown = (html: string) => {
	return turndownService.turndown(html);
};

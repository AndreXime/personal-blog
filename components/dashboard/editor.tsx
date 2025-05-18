'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTheme } from 'next-themes';
import Link from '@tiptap/extension-link';
import { useEffect, useRef } from 'react';
import {
	Bold,
	Italic,
	Strikethrough,
	Heading1,
	Heading2,
	List,
	ListOrdered,
	Minus,
	Link as LinkIcon,
	Undo,
	Redo,
	Heading3,
} from 'lucide-react';

interface TiptapEditorProps {
	initialValue: string;
	onChange: (value: string) => void;
}

export default function TiptapEditor({ initialValue, onChange }: TiptapEditorProps) {
	const { theme } = useTheme();
	const updateTimeout = useRef<number | null>(null);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				autolink: true,
				linkOnPaste: true,
				openOnClick: false,
			}),
		],
		content: initialValue,
		onUpdate: ({ editor }) => {
			if (updateTimeout.current) {
				clearTimeout(updateTimeout.current);
			}
			updateTimeout.current = window.setTimeout(() => {
				onChange(editor.getHTML());
			}, 50);
		},
	});

	useEffect(() => {
		if (!editor) return;
		editor.setOptions({
			editorProps: {
				attributes: {
					class:
						theme === 'dark'
							? 'prose prose-invert p-4 min-h-[500px] focus:outline-none'
							: 'prose p-4 min-h-[500px] focus:outline-none',
				},
			},
		});
	}, [theme, editor]);

	useEffect(() => {
		return () => {
			if (updateTimeout.current) {
				clearTimeout(updateTimeout.current);
			}
		};
	}, []);

	return (
		<div className="border rounded-md">
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
	if (!editor) return null;

	const getButtonClass = (isActive: boolean) =>
		`p-2 rounded cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`;

	return (
		<div className="border-b px-3 py-1 bg-gray-100 dark:bg-gray-800 flex flex-wrap gap-1">
			<span
				title="Negrito"
				onClick={() => editor.chain().toggleBold().run()}
				className={getButtonClass(editor.isActive('bold'))}>
				<Bold className="w-5 h-5" />
			</span>
			<span
				title="Itálico"
				onClick={() => editor.chain().toggleItalic().run()}
				className={getButtonClass(editor.isActive('italic'))}>
				<Italic className="w-5 h-5" />
			</span>
			<span
				title="Tachado"
				onClick={() => editor.chain().toggleStrike().run()}
				className={getButtonClass(editor.isActive('strike'))}>
				<Strikethrough className="w-5 h-5" />
			</span>
			<span
				title="Título 1"
				onClick={() => editor.chain().toggleHeading({ level: 1 }).run()}
				className={getButtonClass(editor.isActive('heading', { level: 1 }))}>
				<Heading1 className="w-5 h-5" />
			</span>
			<span
				title="Título 2"
				onClick={() => editor.chain().toggleHeading({ level: 2 }).run()}
				className={getButtonClass(editor.isActive('heading', { level: 2 }))}>
				<Heading2 className="w-5 h-5" />
			</span>
			<span
				title="Título 3"
				onClick={() => editor.chain().toggleHeading({ level: 3 }).run()}
				className={getButtonClass(editor.isActive('heading', { level: 3 }))}>
				<Heading3 className="w-5 h-5" />
			</span>
			<span
				title="Lista"
				onClick={() => editor.chain().toggleBulletList().run()}
				className={getButtonClass(editor.isActive('bulletList'))}>
				<List className="w-5 h-5" />
			</span>
			<span
				title="Lista Ordenada"
				onClick={() => editor.chain().toggleOrderedList().run()}
				className={getButtonClass(editor.isActive('orderedList'))}>
				<ListOrdered className="w-5 h-5" />
			</span>
			<span
				title="Linha Horizontal"
				onClick={() => editor.chain().setHorizontalRule().run()}
				className={getButtonClass(false)}>
				<Minus className="w-5 h-5" />
			</span>
			<span
				title="Link"
				onClick={() => {
					const isActive = editor.isActive('link');
					if (isActive) {
						editor.chain().focus().unsetLink().run();
					} else {
						editor.chain().focus().setLink({ href: 'https://exemplo.com' }).run(); // substitua se tiver input
					}
				}}
				className={getButtonClass(editor.isActive('link'))}>
				<LinkIcon className="w-5 h-5" />
			</span>
			<span
				title="Desfazer"
				onClick={() => editor.chain().undo().run()}
				className={getButtonClass(false)}>
				<Undo className="w-5 h-5" />
			</span>
			<span
				title="Refazer"
				onClick={() => editor.chain().redo().run()}
				className={getButtonClass(false)}>
				<Redo className="w-5 h-5" />
			</span>
		</div>
	);
}

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

interface TiptapEditorProps {
	initialValue: string;
	onChange: (value: string) => void;
}

export default function TiptapEditor({ initialValue, onChange }: TiptapEditorProps) {
	const { theme } = useTheme();
	const updateTimeout = useRef<number | null>(null);

	const editor = useEditor({
		extensions: [StarterKit],
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
		`p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`;

	return (
		<div className="border-b px-3 py-1 bg-gray-100 dark:bg-gray-800 flex flex-wrap justify-between">
			<span
				onClick={() => editor.chain().toggleBold().run()}
				className={getButtonClass(editor.isActive('bold'))}>
				Negrito
			</span>
			<span
				onClick={() => editor.chain().toggleItalic().run()}
				className={getButtonClass(editor.isActive('italic'))}>
				Itálico
			</span>
			<span
				onClick={() => editor.chain().toggleStrike().run()}
				className={getButtonClass(editor.isActive('strike'))}>
				Tachado
			</span>
			<span
				onClick={() => editor.chain().toggleHeading({ level: 1 }).run()}
				className={getButtonClass(editor.isActive('heading', { level: 1 }))}>
				Título 1
			</span>
			<span
				onClick={() => editor.chain().toggleHeading({ level: 2 }).run()}
				className={getButtonClass(editor.isActive('heading', { level: 2 }))}>
				Título 2
			</span>
			<span
				onClick={() => editor.chain().toggleBulletList().run()}
				className={getButtonClass(editor.isActive('bulletList'))}>
				Lista
			</span>
			<span
				onClick={() => editor.chain().toggleOrderedList().run()}
				className={getButtonClass(editor.isActive('orderedList'))}>
				Lista Ordenada
			</span>
			<span
				onClick={() => editor.chain().setHorizontalRule().run()}
				className={getButtonClass(false)}>
				Linha
			</span>
			<span
				onClick={() => editor.chain().undo().run()}
				className={getButtonClass(false)}>
				Desfazer
			</span>
			<span
				onClick={() => editor.chain().redo().run()}
				className={getButtonClass(false)}>
				Refazer
			</span>
		</div>
	);
}

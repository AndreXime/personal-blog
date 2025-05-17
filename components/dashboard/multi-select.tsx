'use client';

import { useState, useRef } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
	value: string;
	label: string;
}

interface MultiSelectProps {
	options: Option[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = 'Select options' }: MultiSelectProps) {
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSelect = (value: string) => {
		if (selected.includes(value)) {
			onChange(selected.filter((item) => item !== value));
		} else {
			onChange([...selected, value]);
		}
	};

	const handleRemove = (value: string) => {
		onChange(selected.filter((item) => item !== value));
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between h-auto min-h-10">
					<div className="flex flex-wrap gap-1">
						{selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
						{selected.map((value) => {
							const option = options.find((opt) => opt.value === value);
							return option ? (
								<Badge
									key={value}
									variant="secondary"
									className="mr-1 mb-1">
									{option.label}
									<span
										role="button"
										tabIndex={0}
										className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleRemove(value);
											}
										}}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onClick={() => handleRemove(value)}>
										<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
									</span>
								</Badge>
							) : null;
						})}
					</div>
					<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput
						placeholder={`Search ${placeholder.toLowerCase()}...`}
						ref={inputRef}
					/>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={() => handleSelect(option.value)}>
									<Check
										className={cn('mr-2 h-4 w-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

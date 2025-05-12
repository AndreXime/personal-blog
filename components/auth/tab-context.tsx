'use client';

import type React from 'react';

import { createContext, useContext, useState } from 'react';

type TabContextType = {
	Tab: string;
	setTab: React.Dispatch<React.SetStateAction<string>>;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
	const [Tab, setTab] = useState('Inicio');

	return <TabContext.Provider value={{ Tab, setTab }}>{children}</TabContext.Provider>;
}

export function useTab() {
	const context = useContext(TabContext);
	if (context === undefined) {
		throw new Error('useTab must be used within an TabProvider');
	}
	return context;
}

'use client';
import { ProfileForm } from '@/components/panel/profile-form';
import { SettingsForm } from '@/components/panel/settings-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PanelClient() {
	const [Tab, SetTab] = useState('Inicio');

	const ActiveTab = () => {
		switch (Tab) {
			case 'Config':
				return <SettingsForm />;
			default:
				return <ProfileForm />;
		}
	};

	return (
		<main className="container mx-auto py-8 px-16">
			<div className="flex items-center justify-center gap-4 mb-5">
				<Button
					className="bg-orange-400"
					onClick={() => SetTab('Inicio')}>
					Inicio
				</Button>
				<Button
					className="bg-orange-400"
					onClick={() => SetTab('Config')}>
					Configurações
				</Button>
			</div>
			<ActiveTab />
		</main>
	);
}

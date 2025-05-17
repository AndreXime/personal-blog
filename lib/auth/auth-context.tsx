'use client';

import type React from 'react';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Prisma } from '../../prisma/client';
import type { User as FullUser } from '../../prisma/client';

type User = Omit<FullUser, 'password'>;

type Result = Promise<{ error: string | null; success: boolean }>;

type AuthContextType = {
	user: User;

	signOut: () => Promise<void>;
	updateProfile: (data: Prisma.UserUpdateArgs['data']) => Result;
	changePassword: (currentPassword: string, newPassword: string) => Result;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, User }: { children: React.ReactNode; User: User }) {
	const [user, setUser] = useState<User>(User);
	const router = useRouter();

	const signOut = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
			});

			router.push('/');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	const updateProfile = async (data: Prisma.UserUpdateArgs['data']) => {
		try {
			const response = await fetch('/api/auth/user', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();

			if (!response.ok) {
				return { error: responseData.error, success: false };
			}

			setUser(responseData.user);
			return { error: null, success: true };
		} catch {
			return { error: 'An unexpected error occurred', success: false };
		}
	};

	const changePassword = async (currentPassword: string, newPassword: string) => {
		try {
			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ currentPassword, newPassword }),
			});

			const data = await response.json();

			if (!response.ok) {
				return { error: data.error, success: false };
			}

			return { error: null, success: true };
		} catch {
			return { error: 'An unexpected error occurred', success: false };
		}
	};

	const value = {
		user,
		signOut,
		updateProfile,
		changePassword,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

'use client';

import type React from 'react';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { Loader2 } from 'lucide-react';

type User = {
	id: string;
	email: string;
	name?: string;
	role: string;
	emailVerified: boolean;
	avatarUrl?: string;
	bio?: string;
};

type Result = Promise<{ error: string | null; success: boolean }>;

type AuthContextType = {
	user: User;
	signUp: (email: string, password: string, name?: string) => Result;
	signIn: (email: string, password: string) => Result;
	signOut: () => Promise<void>;
	resetPassword: (email: string) => Result;
	updateProfile: (data: Prisma.UserUpdateArgs['data']) => Result;
	changePassword: (currentPassword: string, newPassword: string) => Result;
};

const emptyUser = {
	id: '',
	email: '',
	name: '',
	role: '',
	emailVerified: false,
	avatarUrl: '',
	bio: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>(emptyUser);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Fetch the current user on mount
		const fetchUser = async () => {
			try {
				const response = await fetch('/api/auth/user');
				if (response.ok) {
					const data = await response.json();
					setUser(data.user);
				}
			} catch (error) {
				console.error('Error fetching user:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, []);

	const signUp = async (email: string, password: string, name?: string) => {
		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, name }),
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

	const signIn = async (email: string, password: string) => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				return { error: data.error.message, success: false };
			}

			setUser(data.user);
			router.refresh();
			return { error: null, success: true };
		} catch {
			return { error: 'An unexpected error occurred', success: false };
		}
	};

	const signOut = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
			});
			setUser(emptyUser);
			router.refresh();
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	const resetPassword = async (email: string) => {
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
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
		signUp,
		signIn,
		signOut,
		resetPassword,
		updateProfile,
		changePassword,
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center flex-1">
				<Loader2
					color="blue"
					size={50}
					className="spinner-spin"
				/>
				<span className="sr-only">Loading...</span>
			</div>
		);
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

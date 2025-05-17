import type {
	Post as PrismaPost,
	User as PrismaUser,
	Category as PrismaCategory,
	Tag as PrismaTag,
} from '../prisma/client';

export type Post = PrismaPost;
export type User = Omit<PrismaUser, 'password'>;
export type Category = PrismaCategory;
export type Tag = PrismaTag;

export interface PostWithRelations extends PrismaPost {
	author?: PrismaUser | null;
	categories: PrismaCategory[];
	tags: PrismaTag[];
}

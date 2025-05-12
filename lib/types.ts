import type {
  Post as PrismaPost,
  User as PrismaUser,
  Category as PrismaCategory,
  Tag as PrismaTag,
  Comment as PrismaComment,
} from "@prisma/client"

export type Post = PrismaPost
export type User = PrismaUser
export type Category = PrismaCategory
export type Tag = PrismaTag
export type Comment = PrismaComment

export interface PostWithRelations extends PrismaPost {
  author?: PrismaUser | null
  categories: PrismaCategory[]
  tags: PrismaTag[]
}

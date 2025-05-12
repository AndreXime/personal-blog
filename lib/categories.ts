import { prisma } from "@/lib/prisma"
import type { Category } from "@/lib/types"

export async function getAllCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return prisma.category.findUnique({
    where: {
      slug,
    },
  })
}

import { prisma } from "@/lib/prisma"
import type { Tag } from "@/lib/types"

export async function getAllTags(): Promise<Tag[]> {
  return prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return prisma.tag.findUnique({
    where: {
      slug,
    },
  })
}

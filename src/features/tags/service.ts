import { prisma } from "@/lib/prisma/prisma";

export const TagService = {
  async getAllTags() {
    return await prisma.tag.findMany({ select: { id: true, name: true } });
  },
};

import { prisma } from "@/lib/prisma/prisma";

export const RestaurantsService = {
  getRestaurantsWithCount: async ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => {
    const [restaurants, totalCount] = await prisma.$transaction([
      prisma.restaurant.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { tags: true },
        orderBy: { id: "desc" },
      }),
      prisma.restaurant.count(),
    ]);

    return { restaurants, totalCount };
  },

  getRestaurantBySlug: async (slug: string) => {
    return prisma.restaurant.findUnique({
      where: { slug },
      include: {
        tags: true,
        reviews: { include: { profile: true } },
        menus: {
          where: { isDefault: true },
          include: {
            categories: {
              orderBy: { id: "asc" },
              include: { menuItems: true },
            },
          },
        },
      },
    });
  },

  createRestaurant: async (data: {
    name: string;
    slug: string;
    address?: string;
    description?: string;
    schedule?: string;
    coverImgUrl?: string;
    creatorId: string;
    tagIds?: number[];
  }) => {
    return prisma.restaurant.create({
      select: { id: true },
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address ?? null,
        description: data.description ?? null,
        schedule: data.schedule ?? null,
        coverImgUrl: data.coverImgUrl ?? null,
        createdById: data.creatorId,
        tags: data.tagIds
          ? {
              connect: data.tagIds.map((tagId) => ({ id: tagId })),
            }
          : undefined,
      },
    });
  },

  updateRestaurant: async (
    { id }: { id: number },
    data: {
      name: string;
      address?: string;
      description?: string;
      schedule?: string;
      coverImgUrl?: string;
      tagIds?: number[];
    },
  ) => {
    return prisma.restaurant.update({
      where: { id },
      select: { id: true, slug: true },
      data: {
        name: data.name,
        address: data.address ?? null,
        description: data.description ?? null,
        schedule: data.schedule ?? null,
        coverImgUrl: data.coverImgUrl ?? null,
        tags: {
          set: data.tagIds?.map((tagId) => ({ id: tagId })),
        },
      },
    });
  },
};

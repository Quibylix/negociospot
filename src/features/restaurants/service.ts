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
};

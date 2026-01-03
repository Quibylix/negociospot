import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ResultAsync } from "neverthrow";
import { prisma } from "@/lib/prisma/prisma";
import { Logger } from "../logger/logger";
import { ERRORS, type ErrorKeys } from "../shared/constants/errors";

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
          orderBy: {
            id: "asc",
          },
          include: {
            categories: {
              orderBy: { id: "asc" },
              include: {
                menuItems: {
                  orderBy: { id: "asc" },
                },
              },
            },
          },
        },
      },
    });
  },

  getRestaurantAdminsById: async (id: number) => {
    return prisma.restaurant.findUnique({
      where: { id },
      select: {
        administrators: { select: { profile: true } },
      },
    });
  },

  getRestaurantAdminsBySlug: async (slug: string) => {
    return prisma.restaurant.findUnique({
      where: { slug },
      select: {
        administrators: { select: { profile: true } },
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
    lat?: number;
    lng?: number;
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
        lat: data.lat ?? null,
        lng: data.lng ?? null,
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
      lat?: number;
      lng?: number;
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
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        tags: {
          set: data.tagIds?.map((tagId) => ({ id: tagId })),
        },
      },
    });
  },
};

export function isFavoriteRestaurant({
  userId,
  restaurantUniqueIdentifier,
}: {
  userId: string;
  restaurantUniqueIdentifier: { id: number } | { slug: string };
}) {
  return ResultAsync.fromThrowable(() =>
    prisma.$transaction(async (tx) => {
      const restaurantId = await tx.restaurant
        .findUniqueOrThrow({
          where:
            "id" in restaurantUniqueIdentifier
              ? { id: restaurantUniqueIdentifier.id }
              : { slug: restaurantUniqueIdentifier.slug },
        })
        .then((restaurant) => restaurant.id);

      const favorite = await tx.favorite.findUnique({
        where: {
          profileId_restaurantId: {
            profileId: userId,
            restaurantId: restaurantId,
          },
        },
      });

      return Boolean(favorite);
    }),
  )();
}

export function getFavoriteRestaurants({
  userId,
  offset,
  limit,
}: {
  userId: string;
  offset: number;
  limit: number;
}) {
  return ResultAsync.fromThrowable(() =>
    prisma.favorite.findMany({
      where: { profileId: userId },
      skip: offset,
      take: limit,
      include: { restaurant: { include: { tags: true } } },
      orderBy: { restaurant: { id: "desc" } },
    }),
  )()
    .map((favorites) => favorites.map((fav) => fav.restaurant))
    .mapErr((err) => {
      Logger.error("Error fetching favorite restaurants", err);
      return ERRORS.GENERIC.UNKNOWN_ERROR;
    });
}

export function getFavoriteRestaurantsCount({ userId }: { userId: string }) {
  return ResultAsync.fromThrowable(() =>
    prisma.favorite.count({
      where: { profileId: userId },
    }),
  )().mapErr((err) => {
    Logger.error("Error counting favorite restaurants", err);
    return ERRORS.GENERIC.UNKNOWN_ERROR;
  });
}

export function addFavoriteRestaurant({
  userId,
  restaurantUniqueIdentifier,
}: {
  userId: string;
  restaurantUniqueIdentifier: { id: number } | { slug: string };
}) {
  return ResultAsync.fromThrowable(() =>
    prisma.favorite.create({
      data: {
        profile: {
          connect: { id: userId },
        },
        restaurant: {
          connect:
            "id" in restaurantUniqueIdentifier
              ? { id: restaurantUniqueIdentifier.id }
              : { slug: restaurantUniqueIdentifier.slug },
        },
      },
    }),
  )().mapErr(((err) => {
    const UNIQUE_CONSTRAINT_CODE = "P2002";
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === UNIQUE_CONSTRAINT_CODE
    ) {
      return ERRORS.RESTAURANTS.ALREADY_FAVORITED;
    }

    return ERRORS.GENERIC.UNKNOWN_ERROR;
  }) satisfies (err: unknown) => ErrorKeys);
}

export async function removeFavoriteRestaurant({
  userId,
  restaurantUniqueIdentifier,
}: {
  userId: string;
  restaurantUniqueIdentifier: { id: number } | { slug: string };
}) {
  return ResultAsync.fromThrowable(() =>
    prisma.$transaction(async (tx) => {
      const restaurantId = await tx.restaurant
        .findUniqueOrThrow({
          where:
            "id" in restaurantUniqueIdentifier
              ? { id: restaurantUniqueIdentifier.id }
              : { slug: restaurantUniqueIdentifier.slug },
        })
        .then((restaurant) => restaurant.id);

      return tx.favorite.delete({
        where: {
          profileId_restaurantId: {
            profileId: userId,
            restaurantId: restaurantId,
          },
        },
      });
    }),
  )().mapErr(((err) => {
    const NOT_FOUND_CODE = "P2025";
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === NOT_FOUND_CODE
    ) {
      return ERRORS.RESTAURANTS.NOT_FAVORITED_FOUND;
    }

    return ERRORS.GENERIC.UNKNOWN_ERROR;
  }) satisfies (err: unknown) => ErrorKeys);
}

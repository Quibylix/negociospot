import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ResultAsync } from "neverthrow";
import z from "zod";
import { Prisma } from "@/lib/prisma/generated/client";
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
        _count: { select: { administrators: true } },
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
    phone?: string;
    whatsapp?: string;
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
        phone: data.phone ?? null,
        whatsapp: data.whatsapp ?? null,
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
      phone?: string;
      whatsapp?: string;
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
        phone: data.phone ?? null,
        whatsapp: data.whatsapp ?? null,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        tags: {
          set: data.tagIds?.map((tagId) => ({ id: tagId })),
        },
      },
    });
  },
};

type RestaurantUID = { id: number } | { slug: string };

export function getRestaurantsWithCount({
  offset,
  limit,
  filters,
}: {
  offset?: number;
  limit?: number;
  filters?: {
    query?: string;
    tagIds?: number[];
    location?: {
      lat: number;
      lng: number;
      radiusKm: number;
    };
  };
}) {
  return ResultAsync.fromThrowable(async () => {
    const whereConditions: Prisma.Sql[] = [];

    if (filters?.query) {
      whereConditions.push(
        Prisma.sql`fts @@ websearch_to_tsquery('spanish', ${filters.query})`,
      );
    }

    let distanceColumn = Prisma.sql`NULL::float`;
    if (filters?.location) {
      const { lat, lng, radiusKm } = filters.location;

      whereConditions.push(Prisma.sql`lat IS NOT NULL AND lng IS NOT NULL`);

      const averageEarthRadiusKm = 6371;
      const haversineFormula = Prisma.sql`
      (${averageEarthRadiusKm} * acos(
        cos(radians(${lat})) * cos(radians(lat)) *
        cos(radians(lng) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(lat))
      ))
    `;

      distanceColumn = Prisma.sql`${haversineFormula}`;
      whereConditions.push(Prisma.sql`${haversineFormula} <= ${radiusKm}`);
    }

    if (filters?.tagIds && filters.tagIds.length > 0) {
      whereConditions.push(Prisma.sql`
      id IN (
        SELECT "A" FROM "_RestaurantToTag" 
        WHERE "B" IN (${Prisma.join(filters.tagIds)})
      )
    `);
    }

    const whereClause =
      whereConditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
        : Prisma.empty;

    let orderByClause = Prisma.sql`ORDER BY id DESC`;
    if (filters?.query && filters?.location) {
      orderByClause = Prisma.sql`ORDER BY rank DESC, distance ASC`;
    } else if (filters?.query) {
      orderByClause = Prisma.sql`ORDER BY rank DESC`;
    } else if (filters?.location) {
      orderByClause = Prisma.sql`ORDER BY distance ASC`;
    }

    const totalCountRawSchema = z
      .array(
        z.object({
          count: z.bigint(),
        }),
      )
      .min(1);

    const idsSchema = z.array(
      z.object({
        id: z.number(),
      }),
    );

    const totalCountRaw = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Restaurant"
      ${whereClause}
    `;

    const rawIds = await prisma.$queryRaw`
    SELECT 
      id, 
      ${
        filters?.query
          ? Prisma.sql`ts_rank(fts, websearch_to_tsquery('spanish', ${filters.query}))`
          : Prisma.sql`0`
      } as rank,
      ${distanceColumn} as distance
    FROM "Restaurant"
    ${whereClause}
    ${orderByClause}
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    const restaurantIds = idsSchema.parse(rawIds);
    const totalCount = totalCountRawSchema.parse(totalCountRaw);

    const restaurants = await prisma.restaurant.findMany({
      where: { id: { in: restaurantIds.map((r) => r.id) } },
      include: { tags: true, _count: { select: { administrators: true } } },
    });

    const restaurantMap = new Map(
      restaurants.map((restaurant) => [restaurant.id, restaurant]),
    );
    const sortedRestaurants = restaurantIds
      .map((r) => restaurantMap.get(r.id))
      .filter((restaurant): restaurant is NonNullable<typeof restaurant> =>
        Boolean(restaurant),
      );

    return {
      restaurants: sortedRestaurants,
      totalCount: Number(totalCount[0].count),
    };
  })().mapErr((err) => {
    Logger.error("Error fetching restaurants with filters", err);
    return ERRORS.GENERIC.UNKNOWN_ERROR;
  });
}

export function getRestaurantAccessInfo({ uid }: { uid: RestaurantUID }) {
  return ResultAsync.fromThrowable(() =>
    prisma.restaurant.findUnique({
      where: uid,
      select: {
        createdById: true,
        administrators: { select: { profileId: true } },
      },
    }),
  )().mapErr((err) => {
    Logger.error("Error fetching restaurant access info", err);
    return ERRORS.GENERIC.UNKNOWN_ERROR;
  });
}

export function isFavoriteRestaurant({
  userId,
  restaurantUniqueIdentifier,
}: {
  userId: string;
  restaurantUniqueIdentifier: RestaurantUID;
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
      include: {
        restaurant: {
          include: {
            tags: true,
            _count: {
              select: {
                administrators: true,
              },
            },
          },
        },
      },
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
  restaurantUniqueIdentifier: RestaurantUID;
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
  restaurantUniqueIdentifier: RestaurantUID;
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

export async function registerRestaurantChangeSuggestion({
  uid,
  data,
  creatorId,
}: {
  uid: RestaurantUID;
  creatorId: string;
  data: {
    name: string;
    address?: string;
    description?: string;
    schedule?: string;
    tagIds?: number[];
    lat?: number;
    lng?: number;
  };
}) {
  return ResultAsync.fromThrowable(() =>
    prisma.changeSuggestion.create({
      select: { restaurant: { select: { id: true, slug: true } } },
      data: {
        restaurant: {
          connect: "id" in uid ? { id: uid.id } : { slug: uid.slug },
        },
        data,
        creator: {
          connect: { id: creatorId },
        },
      },
    }),
  )().mapErr((err) => {
    Logger.error("Error registering restaurant change suggestion", err);
    return ERRORS.GENERIC.UNKNOWN_ERROR;
  });
}

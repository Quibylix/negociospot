import type { TransactionClient } from "@/lib/prisma/generated/internal/prismaNamespace";
import { prisma } from "@/lib/prisma/prisma";

export async function getMenuById(id: number) {
  return prisma.menu.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      categories: {
        select: {
          id: true,
          name: true,
          menuItems: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
            },
            orderBy: { id: "asc" },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });
}

export async function createMenu(data: {
  restaurantSlug: string;
  name: string;
  categories: {
    name: string;
    items: { name: string; description?: string; price: number }[];
  }[];
}) {
  return prisma.menu.create({
    select: { id: true },
    data: {
      restaurant: {
        connect: { slug: data.restaurantSlug },
      },
      name: data.name,
      categories: {
        create: data.categories.map((category) => ({
          name: category.name,
          menuItems: {
            create: category.items.map((item) => ({
              name: item.name,
              description: item.description ?? null,
              price: item.price,
            })),
          },
        })),
      },
    },
  });
}

export async function checkMenuBelongsToRestaurant(
  menuId: number,
  restaurantSlug: string,
) {
  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    select: {
      restaurant: {
        select: { slug: true },
      },
    },
  });

  return menu?.restaurant.slug === restaurantSlug;
}

export async function updateMenu(
  id: number,
  data: {
    name: string;
    categories: {
      id?: number;
      name: string;
      items: {
        id?: number;
        name: string;
        description?: string;
        price: number;
      }[];
    }[];
  },
) {
  return prisma.$transaction(async (tx) => {
    const menuResponse = await tx.menu.update({
      select: { id: true },
      where: { id },
      data: {
        name: data.name,
      },
    });

    const categoriesIdsToKeep = data.categories
      .filter((cat) => Boolean(cat.id))
      .map((cat) => cat.id ?? 0);

    await tx.menuCategory.deleteMany({
      where: {
        menuId: id,
        id: { notIn: categoriesIdsToKeep },
      },
    });

    await Promise.all(
      data.categories.map((category) => updateMenuCategory(tx, id, category)),
    );

    return menuResponse;
  });
}

async function updateMenuCategory(
  tx: TransactionClient,
  menuId: number,
  category: {
    id?: number;
    name: string;
    items: {
      id?: number;
      name: string;
      description?: string;
      price: number;
    }[];
  },
) {
  if (!category.id) {
    return await tx.menuCategory.create({
      data: {
        menuId,
        name: category.name,
        menuItems: {
          create: category.items.map((item) => ({
            name: item.name,
            description: item.description ?? null,
            price: item.price,
          })),
        },
      },
    });
  }

  await tx.menuCategory.update({
    where: { id: category.id, menuId },
    data: {
      name: category.name,
    },
  });

  const itemsIdsToKeep = category.items
    .filter((item) => Boolean(item.id))
    .map((item) => item.id ?? 0);

  await tx.menuItem.deleteMany({
    where: {
      category: {
        id: category.id,
        menuId,
      },
      id: { notIn: itemsIdsToKeep },
    },
  });

  await Promise.all(
    category.items.map((item) =>
      updateMenuItem(tx, menuId, category.id as number, item),
    ),
  );
}

async function updateMenuItem(
  tx: TransactionClient,
  menuId: number,
  categoryId: number,
  item: {
    id?: number;
    name: string;
    description?: string;
    price: number;
  },
) {
  if (!item.id) {
    return await tx.menuItem.create({
      data: {
        category: {
          connect: { id: categoryId, menuId },
        },
        name: item.name,
        description: item.description ?? null,
        price: item.price,
      },
    });
  }

  return await tx.menuItem.update({
    where: {
      id: item.id,
      category: {
        id: categoryId,
        menuId,
      },
    },
    data: {
      name: item.name,
      description: item.description ?? null,
      price: item.price,
    },
  });
}

export async function deleteMenu(id: number) {
  return prisma.menu.delete({
    where: { id },
  });
}

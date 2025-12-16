import type { TransactionClient } from "@/lib/prisma/generated/internal/prismaNamespace";
import { prisma } from "@/lib/prisma/prisma";

export async function createMenu(data: {
  restaurantId: number;
  name: string;
  categories: {
    name: string;
    items: { name: string; description?: string; price: number }[];
  }[];
}) {
  return prisma.menu.create({
    select: { id: true },
    data: {
      restaurantId: data.restaurantId,
      name: data.name,
      categories: {
        create: data.categories.map((category) => ({
          name: category.name,
          items: {
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
    where: { id: category.id },
    data: {
      name: category.name,
    },
  });

  const itemsIdsToKeep = category.items
    .filter((item) => Boolean(item.id))
    .map((item) => item.id ?? 0);

  await tx.menuItem.deleteMany({
    where: {
      categoryId: category.id,
      id: { notIn: itemsIdsToKeep },
    },
  });

  await Promise.all(
    category.items.map((item) =>
      updateMenuItem(tx, category.id as number, item),
    ),
  );
}

async function updateMenuItem(
  tx: TransactionClient,
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
        categoryId,
        name: item.name,
        description: item.description ?? null,
        price: item.price,
      },
    });
  }

  return await tx.menuItem.update({
    where: { id: item.id },
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

import { Container } from "@mantine/core";
import { notFound } from "next/navigation";
import { Logger } from "@/features/logger/logger";
import { UpdateRestaurantForm } from "@/features/restaurants/components/update-restaurant-form/update-restaurant-form.component";
import { RestaurantsService } from "@/features/restaurants/service";
import { TagService } from "@/features/tags/service";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const restaurant = await RestaurantsService.getRestaurantBySlug(slug).catch(
    (error) => {
      Logger.warn(`Restaurant with slug "${slug}" not found.`, error);
      return null;
    },
  );

  if (!restaurant) {
    notFound();
  }

  let tags: { id: number; name: string }[];
  try {
    tags = await TagService.getAllTags();
  } catch (e) {
    Logger.error("Failed to fetch tags for restaurant creation", { error: e });
    tags = [];
  }

  return (
    <Container size={1500} py="xl">
      <UpdateRestaurantForm
        id={restaurant.id}
        initialValues={{
          name: restaurant.name,
          description: restaurant.description ?? "",
          address: restaurant.address ?? "",
          coverImgUrl: restaurant.coverImgUrl ?? "",
          schedule: restaurant.schedule ?? "",
          tags: restaurant.tags.map((tag) => tag.id),
        }}
        availableTags={tags}
      />
    </Container>
  );
}

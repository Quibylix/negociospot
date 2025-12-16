import { Container } from "@mantine/core";
import { Logger } from "@/features/logger/logger";
import { CreateRestaurantForm } from "@/features/restaurants/components/create-restaurant-form/create-restaurant-form.component";
import { TagService } from "@/features/tags/service";

export default async function CreateRestaurantPage() {
  let tags: { id: number; name: string }[];
  try {
    tags = await TagService.getAllTags();
  } catch (e) {
    Logger.error("Failed to fetch tags for restaurant creation", { error: e });
    tags = [];
  }

  return (
    <Container size={1500} py="xl">
      <CreateRestaurantForm availableTags={tags} />
    </Container>
  );
}

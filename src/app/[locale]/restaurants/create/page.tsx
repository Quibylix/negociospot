import { Container } from "@mantine/core";
import { CreateRestaurantForm } from "@/features/restaurants/components/create-restaurant-form/create-restaurant-form.component";

export default function CreateRestaurantPage() {
  return (
    <Container size="xl" py="xl">
      <CreateRestaurantForm />
    </Container>
  );
}

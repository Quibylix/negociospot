import { Container } from "@mantine/core";
import { CreateRestaurantForm } from "@/features/restaurants/components/create-restaurant-form/create-restaurant-form.component";

export default function CreateRestaurantPage() {
  return (
    <Container size={1500} py="xl">
      <CreateRestaurantForm />
    </Container>
  );
}

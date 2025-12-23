"use client";

import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconClock,
  IconDirections,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMap } from "@/lib/google-maps/use-map.hook";
import type { RestaurantDetailProps } from "./service-to-detail-adapter";

export type RestaurantDetailBasicInfoProps = {
  description: RestaurantDetailProps["description"];
  address: RestaurantDetailProps["address"];
  schedule: RestaurantDetailProps["schedule"];
  phone: RestaurantDetailProps["phone"];
  whatsapp: RestaurantDetailProps["whatsapp"];
  lat: RestaurantDetailProps["lat"];
  lng: RestaurantDetailProps["lng"];
};

export function RestaurantDetailBasicInfo({
  description,
  address,
  schedule,
  phone,
  whatsapp,
  lat,
  lng,
}: RestaurantDetailBasicInfoProps) {
  const t = useTranslations("restaurant.detail");
  const { mapRef } = useMap({ lat: lat ?? 0, lng: lng ?? 0 });

  return (
    <Stack>
      <Card withBorder radius="md" p="md">
        <Title order={4} mb="md">
          {t("information")}
        </Title>
        <Stack gap="md">
          <Text size="sm">{description || t("no_description")}</Text>
          <Stack p={0} gap="sm">
            <Group wrap="nowrap">
              <ThemeIcon variant="light" color="blue">
                <IconMapPin size={18} />
              </ThemeIcon>
              <Text size="sm">{address || t("no_address")}</Text>
            </Group>
            {lat && lng && (
              <Container p={0} m={0}>
                <div ref={mapRef} style={{ aspectRatio: 1 }} />
                <Button
                  component="a"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="subtle"
                  fullWidth
                  rightSection={<IconDirections size={18} />}
                >
                  {t("how_to_get_there")}
                </Button>
              </Container>
            )}
          </Stack>
          <Group wrap="nowrap">
            <ThemeIcon variant="light" color="orange">
              <IconClock size={18} />
            </ThemeIcon>
            <Text size="sm">{schedule || t("no_schedule")}</Text>
          </Group>
          {phone && (
            <Button
              component="a"
              href={`tel:${phone}`}
              variant="outline"
              leftSection={<IconPhone size={18} />}
              fullWidth
            >
              {t("call")}
            </Button>
          )}
          {whatsapp && (
            <Button
              component="a"
              href={`https://wa.me/${whatsapp}`}
              color="green"
              leftSection={<IconBrandWhatsapp size={18} />}
              fullWidth
            >
              {t("whatsapp")}
            </Button>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

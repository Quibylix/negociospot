"use client";

import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconClock,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
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

  return (
    <Stack>
      <Card withBorder radius="md" p="md">
        <Title order={4} mb="md">
          {t("information")}
        </Title>
        <Stack gap="md">
          <Text size="sm">{description || t("no_description")}</Text>
          <Group wrap="nowrap">
            <ThemeIcon variant="light" color="blue">
              <IconMapPin size={18} />
            </ThemeIcon>
            <Text size="sm">{address || t("no_address")}</Text>
          </Group>
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

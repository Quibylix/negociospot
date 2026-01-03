"use client";

import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  List,
  ListItem,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function ClaimRestaurantModal() {
  const [isOpened, { toggle }] = useDisclosure(false);
  const t = useTranslations("restaurant.claim");

  return (
    <>
      <Tooltip
        label={t("why_claim")}
        withArrow
        events={{ hover: true, focus: true, touch: true }}
        multiline
      >
        <Button onClick={toggle}>{t("claim_business")}</Button>
      </Tooltip>
      <Modal
        opened={isOpened}
        onClose={toggle}
        title={
          <Text fz="lg" fw="bold">
            {t("modal.title")}
          </Text>
        }
      >
        <Text fw="bold" mb="sm">
          {t("why_claim")}
        </Text>
        <Text mb="xs">{t("modal.description_1")}</Text>
        <Group justify="space-between" mb="xs" bg="gray.0" p="xs">
          {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
          <CopyButton
            value={process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? ""}
            timeout={2000}
          >
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
        <Text mb="sm">{t("modal.description_2")}</Text>
        <List withPadding mb="sm">
          <ListItem>{t("modal.info_1")}</ListItem>
          <ListItem>{t("modal.info_2")}</ListItem>
          <ListItem>{t("modal.info_3")}</ListItem>
          <ListItem>{t("modal.info_4")}</ListItem>
        </List>
        <Text fw="bold">{t("modal.closing")}</Text>
      </Modal>
    </>
  );
}

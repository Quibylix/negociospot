import { Box, Container, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Link } from "@/features/i18n/navigation";
import { Logo } from "../logo.component";
import classes from "./footer.module.css";

export type FooterProps = {
  links: {
    title: string;
    links: {
      label: string;
      href: string;
    }[];
  }[];
};

export function Footer({ links }: FooterProps) {
  const t = useTranslations("footer");

  const groups = links.map((group) => {
    const links = group.links.map((link) => (
      <Text
        key={link.label}
        className={classes.link}
        component={Link}
        href={link.href}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        <Stack gap={0}>{links}</Stack>
      </div>
    );
  });

  return (
    <Box component="footer" className={classes.footer} px="md" py="xl">
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.logo}>
            <Logo />
            <Text size="sm" c="dimmed" className={classes.description}>
              {t("description")}
            </Text>
          </div>
          <div className={classes.groups}>{groups}</div>
        </div>
      </Container>
    </Box>
  );
}

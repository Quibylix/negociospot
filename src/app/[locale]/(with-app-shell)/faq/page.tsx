import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Container,
  Stack,
  Title,
} from "@mantine/core";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function FaqPage() {
  const t = await getTranslations("faq");

  if (!t) {
    notFound();
  }

  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "";

  const faqs = [
    {
      question: t("q1"),
      answer: t("a1"),
    },
    {
      question: t("q2"),
      answer: t("a2"),
    },
    {
      question: t("q3", { supportEmail }),
      answer: t("a3", { supportEmail }),
    },
  ];

  return (
    <Container size="lg" py={50}>
      <Stack gap={50}>
        <Title ta="center">{t("title")}</Title>
        <Accordion variant="separated">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionControl>{faq.question}</AccordionControl>
              <AccordionPanel>{faq.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Stack>
    </Container>
  );
}

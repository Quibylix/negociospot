import {
  Box,
  Card,
  Container,
  Group,
  Image,
  List,
  ListItem,
  Paper,
  Text,
  Title,
  Typography,
} from "@mantine/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "@/features/blog/service";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const mdComponents: Components = {
  h1: ({ children }) => (
    <Title order={1} c="primary.5" mt="xl" mb="sm">
      {children}
    </Title>
  ),
  h2: ({ children }) => (
    <Title order={2} mt="lg" mb="xs">
      {children}
    </Title>
  ),
  p: ({ children }) => (
    <Text size="md" lh={1.7} mb="md">
      {children}
    </Text>
  ),
  img: ({ src, alt }) => (
    <Paper
      component="span"
      display="block"
      shadow="md"
      radius="md"
      p={0}
      mb="xl"
      style={{ overflow: "hidden" }}
    >
      <Image src={src} alt={alt} fit="cover" mb={0} />
      {alt && (
        <Text
          component="span"
          display="block"
          size="sm"
          c="dimmed"
          ta="center"
          p="xs"
          bg="gray.0"
        >
          {alt}
        </Text>
      )}
    </Paper>
  ),
  ul: ({ children }) => (
    <List withPadding mb="md" spacing="sm" type="unordered">
      {children}
    </List>
  ),
  li: ({ children }) => <ListItem>{children}</ListItem>,
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const paramsResolved = await params;

  const f = await getFormatter();
  const t = await getTranslations("blog");
  const postResult = await getPost({ uid: { slug: paramsResolved.slug } });

  if (postResult.isErr() || !postResult.value) {
    notFound();
  }

  const post = postResult.value;

  return (
    <Container component="article" size="md" p={0}>
      <Box maw={1200} m="auto">
        <Image
          src={post.coverImgUrl || "https://placehold.co/1200x400?text=Cover"}
          style={{ aspectRatio: "8 / 3" }}
          alt={post.title}
          h="auto"
          w="100%"
          fit="cover"
          radius="md"
        />
        <Container size="lg" pos="relative">
          <Card
            shadow="md"
            radius="md"
            p="lg"
            pos="relative"
            top={-40}
            mb={-40}
          >
            <Group justify="space-between" align="center">
              <Title
                textWrap="wrap"
                order={1}
                fz={{ base: "h3", sm: "h2", md: "h1" }}
              >
                {post.title}
              </Title>
              {post.publishedAt && (
                <Text c="dimmed">
                  {t("published_on")}{" "}
                  {f.dateTime(post.publishedAt, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Text>
              )}
            </Group>
          </Card>
        </Container>
      </Box>
      <Container px="lg" mt="lg" size="lg">
        <Typography>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {post.content}
          </ReactMarkdown>
        </Typography>
      </Container>
    </Container>
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const paramsResolved = await params;

  const t = await getTranslations("blog");
  const postResult = await getPost({ uid: { slug: paramsResolved.slug } });

  if (postResult.isErr() || !postResult.value) {
    return {
      title: t("post_not_found"),
    };
  }

  return {
    title: postResult.value.title,
  };
}

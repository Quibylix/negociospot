import {
  Anchor,
  Card,
  CardSection,
  Container,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { getFormatter, getTranslations } from "next-intl/server";
import { getPublishedPosts } from "@/features/blog/service";
import { Link } from "@/features/i18n/navigation";

export default async function BlogListPage() {
  const f = await getFormatter();
  const t = await getTranslations("blog");
  const postsResult = await getPublishedPosts();

  if (postsResult.isErr()) {
    return (
      <Container py="xl">
        <Title order={1} mb="xl">
          {t("title")}
        </Title>
        <Text>{t("no_posts")}</Text>
      </Container>
    );
  }

  const posts = postsResult.value;

  return (
    <Container py="xl">
      <Title order={1} mb="xl">
        {t("title")}
      </Title>
      {posts.length === 0 ? (
        <Text>{t("no_posts")}</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {posts.map((post) => (
            <Card
              key={post.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              component={Link}
              href={`/blog/${post.slug}`}
            >
              <CardSection>
                <Image
                  src={post.coverImgUrl || "/placeholder-image.jpg"}
                  height={160}
                  alt={post.title}
                />
              </CardSection>

              <Title order={3} mt="md">
                {post.title}
              </Title>

              <Text size="sm" mt="xs" lineClamp={3}>
                {post.excerpt}
              </Text>

              {post.publishedAt && (
                <Text size="sm" c="dimmed" mt="sm">
                  {f.dateTime(post.publishedAt, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Text>
              )}

              <Anchor mt="xs" size="sm" component="p">
                {t("read_more")}
              </Anchor>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

import { ResultAsync } from "neverthrow";
import { Logger } from "@/features/logger/logger";
import { ERRORS } from "@/features/shared/constants/errors";
import { prisma } from "@/lib/prisma/prisma";

export type BlogUID = { id: number } | { slug: string };

export function getPublishedPosts() {
  return ResultAsync.fromThrowable(
    async () => {
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
          coverImgUrl: true,
          content: true,
        },
      });

      return posts.map((post) => {
        const excerpt = post.content
          .replace(
            /#{1,6}\s.*|\*\*.+?\*\*|`.+?`|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g,
            "",
          )
          .replace(/\s\s+/g, " ")
          .trim()
          .slice(0, 150);

        const { content: _, ...postWithoutContent } = post;
        return {
          ...postWithoutContent,
          excerpt: `${excerpt}...`,
        };
      });
    },
    (err) => {
      Logger.error("Error fetching published posts", err);
      return ERRORS.GENERIC.UNKNOWN_ERROR;
    },
  )();
}

export function getPost({ uid }: { uid: BlogUID }) {
  return ResultAsync.fromThrowable(
    () =>
      prisma.blogPost.findUnique({
        where: uid,
        include: {
          categories: true,
          tags: true,
        },
      }),
    (err) => {
      Logger.error("Error fetching post", { err, uid });
      return ERRORS.GENERIC.UNKNOWN_ERROR;
    },
  )();
}

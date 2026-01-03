"use client";

import {
  Center,
  Group,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  PaginationRoot,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/features/i18n/navigation";
import { PAGE_SEARCH_PARAM } from "@/features/shared/constants/page-search-param.constant";

export function PaginationControl({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get(PAGE_SEARCH_PARAM)) || 1;

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(PAGE_SEARCH_PARAM, page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Center mt="xl">
      <PaginationRoot
        total={totalPages}
        value={currentPage}
        onChange={handleChange}
      >
        <Group wrap="nowrap" gap={5}>
          <PaginationPrevious />
          <Group gap={5} justify="center">
            <PaginationItems />
          </Group>
          <PaginationNext />
        </Group>
      </PaginationRoot>
    </Center>
  );
}

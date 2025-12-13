"use client";

import { Center, Pagination } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/features/i18n/navigation";

export const PAGE_SEARCH_PARAM = "page";

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
      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={handleChange}
      />
    </Center>
  );
}

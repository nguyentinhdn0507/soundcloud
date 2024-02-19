"use client";
import Button from "@mui/material/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface IProps {
  slug?: string;
  currentPage: number;
  pageSize: number;
  text: string;
}

const ButtonCommon: React.FC<IProps> = ({ currentPage, text }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleLoadMore = () => {
    if (currentPage) {
      const nextPageValue = Number(currentPage) + 1;
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.set("current", String(nextPageValue));
      replace(`${pathname}?${updatedParams.toString()}`);
    }
  };

  return (
    <Button variant="outlined" onClick={handleLoadMore}>
      {text}
    </Button>
  );
};

export default ButtonCommon;

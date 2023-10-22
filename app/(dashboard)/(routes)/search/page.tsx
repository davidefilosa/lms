import SearchInput from "@/components/search-input";
import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { getCourses } from "@/actions/get-courses";
import Categories from "./_components/categories";
import CoursesList from "@/components/courses-list";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await prismadb.category.findMany({
    orderBy: { name: "asc" },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;

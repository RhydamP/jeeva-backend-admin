import { useMutation, useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import BlogRequest from "../../../workflows/blog/types"


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

type BlogResponse = {
    blogs: Array<BlogRequest>;
    count: number;
    limit: number;
    offset: number;
}  

export const BlogGet =(pagination: { limit: number; offset: number }) => {
  const { data, isLoading, refetch } = useQuery<BlogResponse>({
    queryFn: () => sdk.client.fetch(`/admin/blogs`, {
      query: {
        limit: pagination.limit,
        offset: pagination.offset,
      },
    }),
    queryKey: ["blogs", pagination.limit, pagination.offset],
  })
  return {data, isLoading, refetch };
}


export const useCreateBlog = () => {
  return useMutation({
      mutationFn: async (formData: FormData) => {
          const response = await fetch(`${BACKEND_URL}/admin/blogs`, {
              method: "POST",
              body: formData,
          });

          if (!response.ok) {
              throw new Error("Failed to create blog");
          }

          return response.json();
      },
  });
};


export const GetBlogById = () => {
  return useMutation({
    mutationFn: async ( id : string) => {
      const response = await fetch(`${BACKEND_URL}/admin/blogs/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get blog");
      }

      return response.json();
    },
  });
};

export const useUpdateBlog = () => {
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await fetch(`${BACKEND_URL}/admin/blogs/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }

      return response.json();
    },
  });
};


export const useDeleteBlog = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BACKEND_URL}/admin/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      return response.json();
    },
  });
};
import { useMutation, useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import BlogRequest from "../../../workflows/blog/types"


type BlogResponse = {
    blogs: Array<BlogRequest>;
    count: number;
    limit: number;
    offset: number;
}  

export const BlogGet =(pagination: { limit: number; offset: number }): [BlogResponse | undefined, boolean] => {
  const { data, isLoading } = useQuery<BlogResponse>({
    queryFn: () => sdk.client.fetch(`/admin/blogs`, {
      query: {
        limit: pagination.limit,
        offset: pagination.offset,
      },
    }),
    queryKey: ["blogs", pagination.limit, pagination.offset],
  })
  return [data, isLoading];
}


export const useCreateBlog = () => {
  return useMutation({
      mutationFn: async (formData: FormData) => {
          const response = await fetch("http://localhost:9000/admin/blogs", {
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
    mutationFn: async ( id : { id: string}) => {
      const response = await fetch(`http://localhost:9000/admin/blogs/${id}`, {
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
      const response = await fetch(`http://localhost:9000/admin/blogs/${id}`, {
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
      const response = await fetch(`http://localhost:9000/admin/blogs/${id}`, {
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
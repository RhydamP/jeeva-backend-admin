import { defineRouteConfig, RouteConfig } from "@medusajs/admin-sdk";
import { Photo } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import BlogContent from "../../widgets/blog-widget";

const BlogsPage = () => {
  return (
    
      <BlogContent/>
  );
};

export const config: RouteConfig = defineRouteConfig({
  label: "Blogs", // Sidebar Label
  icon: Photo, // Sidebar Icon
});

export default BlogsPage;

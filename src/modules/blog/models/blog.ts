import { model } from "@medusajs/framework/utils";

const Blog = model.define("blog", {
  id: model.id().primaryKey(),
  author: model.text().nullable(),
  tags: model.array().nullable(),
  
  // SEO Fields
  seo_title: model.text().unique().nullable(),
  seo_keywords: model.text().nullable(),
  seo_description: model.text().unique().nullable(),
  url_slug: model.text().unique().nullable(),

  // Content Fields
  title: model.text().nullable(),
  subtitle: model.text().nullable(),
  description: model.json().nullable(),
  draft: model.boolean(),

  // Media Fields
  thumbnail_image1: model.text().nullable(),
  thumbnail_image2: model.text().nullable(),
  thumbnail_image3: model.text().nullable(),


  // Metadata
  published_date: model.dateTime().nullable(),
  updated_date: model.dateTime().nullable(),
  
  // Social Media Meta
  social_media_meta: model.json().nullable(),

  // Additional SEO fields for structured data
  canonical_url: model.text().nullable(),
  alt_tags: model.json().nullable(),
  internal_links: model.json().nullable(),
  external_links: model.json().nullable()
});

export default Blog;

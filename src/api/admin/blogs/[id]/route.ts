import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { BLOG_MODULE } from "src/modules/blog";
import BlogModuleService from "src/modules/blog/service";
import BlogRequest from "src/workflows/blog/types";
type ImageKey = 'thumbnail_image1' | 'thumbnail_image2' | 'thumbnail_image3';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  const queryOptions = {
    entity: "blog",
    fields: ['*'], // specify the fields you want to retrieve
  }

  try {
    const { data: blogs } = await query.graph({
      ...queryOptions,
      filters: {
        id: id
      }
    })

    if (blogs.length === 0) {
      return res.status(404).json({ message: "Blog not found" })
    }

    res.json({
      blog: blogs[0]
    })
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the blog" })
  }
}
export const PUT = async (
  req: AuthenticatedMedusaRequest<BlogRequest>,
  res: MedusaResponse
) => {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE);
    const { id } = req.params;

    // Type the files object from multer
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Destructure body values; use defaults where applicable.
    const {
      author,
      seo_title,
      seo_keywords,
      seo_description,
      url_slug,
      title,
      subtitle,
      description,
      draft,
      published_date,
      updated_date,
      social_media_meta,
      canonical_url,
      alt_tags,
      internal_links,
      external_links,
      removed_images
    } = req.body;

    // Log incoming data for debugging (consider removing or reducing logging in production)
    console.log("Incoming Data:", req.body);
    console.log("Files received:", files);

    // Prepare an object to store new image URLs from the upload process.
    let uploadedImages: Record<ImageKey, string | null> = {
      thumbnail_image1: null,
      thumbnail_image2: null,
      thumbnail_image3: null,
    };

    // Build an array mapping file fields to their file, if provided.
    const fileFields: Array<{ field: ImageKey; file: Express.Multer.File }> = [];

    if (files.thumbnail_image1 && files.thumbnail_image1.length > 0) {
      fileFields.push({ field: 'thumbnail_image1', file: files.thumbnail_image1[0] });
    }
    if (files.thumbnail_image2 && files.thumbnail_image2.length > 0) {
      fileFields.push({ field: 'thumbnail_image2', file: files.thumbnail_image2[0] });
    }
    if (files.thumbnail_image3 && files.thumbnail_image3.length > 0) {
      fileFields.push({ field: 'thumbnail_image3', file: files.thumbnail_image3[0] });
    }

    // Upload files if any are present
    if (fileFields.length > 0) {
      const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: fileFields.map(({ file }) => ({
            filename: file.originalname,
            mimeType: file.mimetype,
            content: file.buffer.toString("binary"),
            access: "public",
          })),
        },
      });

      // Map each upload result back to the correct image key.
      fileFields.forEach((item, idx) => {
        if (result[idx] && result[idx].url) {
          uploadedImages[item.field] = result[idx].url;
        }
      });
    }

    // Retrieve current blog data so we can fill in any missing data.
    const currentBlog = await blogModuleService.retrieveBlog(id);

    // Parse removed_images safely. We expect removed_images to be a JSON array of keys.
    let parsedRemovedImages: ImageKey[] = [];
    if (removed_images) {
      if (typeof removed_images === "string") {
        try {
          parsedRemovedImages = JSON.parse(removed_images);
        } catch (parseError) {
          throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid format for removed_images");
        }
      } else if (Array.isArray(removed_images)) {
        parsedRemovedImages = removed_images;
      }
    }

    // Build the final images object.
    // If a field is marked as removed, set it to null.
    // Otherwise, use the newly uploaded image if provided; if not, fall back to the current blog image.
    const finalImages: Record<ImageKey, string | null> = {
      thumbnail_image1: parsedRemovedImages.includes("thumbnail_image1")
        ? null
        : (uploadedImages.thumbnail_image1 || currentBlog.thumbnail_image1),
      thumbnail_image2: parsedRemovedImages.includes("thumbnail_image2")
        ? null
        : (uploadedImages.thumbnail_image2 || currentBlog.thumbnail_image2),
      thumbnail_image3: parsedRemovedImages.includes("thumbnail_image3")
        ? null
        : (uploadedImages.thumbnail_image3 || currentBlog.thumbnail_image3),
    };

    // Prepare update payload.
    const updatedData = {
      id,
      author: author || currentBlog.author,
      tags: req.body.tags ? req.body.tags.split(",") : currentBlog.tags,
      seo_title: seo_title || currentBlog.seo_title,
      seo_keywords: seo_keywords || currentBlog.seo_keywords,
      seo_description: seo_description || currentBlog.seo_description,
      url_slug: url_slug || currentBlog.url_slug,
      title: title || currentBlog.title,
      subtitle: subtitle || currentBlog.subtitle,
      description: description || currentBlog.description,
      draft: draft === "true" ? true : currentBlog.draft,
      published_date: published_date || currentBlog.published_date,
      updated_date: updated_date || currentBlog.updated_date,
      social_media_meta: social_media_meta || currentBlog.social_media_meta,
      canonical_url: canonical_url || currentBlog.canonical_url,
      alt_tags: alt_tags ?? currentBlog.alt_tags,
      internal_links: internal_links ?? currentBlog.internal_links,
      external_links: external_links ?? currentBlog.external_links,
      ...finalImages,
    };

    const updatedBlog = await blogModuleService.updateBlogs(updatedData);

    return res.json({ blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    // Return a more descriptive error message if available.
    return res.status(400).json({ error: error.message || "An error occurred while updating the blog" });
  }
};

  export const DELETE = async (
    req: AuthenticatedMedusaRequest<BlogRequest>,
    res: MedusaResponse
  ) => {
    try {

    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params
  
   
      await blogModuleService.deleteBlogs(id)
      res.status(200).json({ message: "Blog post deleted successfully" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

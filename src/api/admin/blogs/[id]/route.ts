import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { BLOG_MODULE } from "src/modules/blog";
import BlogModuleService from "src/modules/blog/service";
import BlogRequest from "src/workflows/blog/types";

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
    const blogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params

    const files = req.files as Express.Multer.File[]
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
        external_links
      } = req.body
      
      console.log(req.body);
  
      if (!files?.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "No files were uploaded"
        )
      }
  
      const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: files.map((file) => ({
            filename: file.originalname,
            mimeType: file.mimetype,
            content: file.buffer.toString("binary"),
            access: "public",
          })),
        },
      })
  
      const uploadedTags = req.body.tags ? req.body.tags?.split(',') : [];;
      const uploadedImages = result.map(file => file.url)
    
      const updatedBlog = await blogModuleService.updateBlogs({
        id,
        author: author || '',
        tags: uploadedTags,
        seo_title: seo_title || '',
        seo_keywords: seo_keywords || '',
        seo_description: seo_description || '',
        url_slug: url_slug || '',
        title: title || '',
        subtitle: subtitle || '',
        description: description || '',
        draft: draft === 'true',
        thumbnail_image1: uploadedImages[0] || null,
        thumbnail_image2: uploadedImages[1] || null,
        thumbnail_image3: uploadedImages[2] || null,
        published_date: published_date || null,
        updated_date: updated_date || null,
        social_media_meta: social_media_meta || null,
        canonical_url: canonical_url || null,
        alt_tags: alt_tags ?? null,
        internal_links: internal_links ?? null,
        external_links: external_links ?? null
      })
  
      res.json({ blog: updatedBlog })
    }  catch (error) {
      res.status(400).json({ error: error.message })
    }
  }


  export const DELETE = async (
    req: AuthenticatedMedusaRequest<BlogRequest>,
    res: MedusaResponse
  ) => {
    try {

    const blogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params
  
   
      await blogModuleService.deleteBlogs(id)
      res.status(200).json({ message: "Blog post deleted successfully" })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

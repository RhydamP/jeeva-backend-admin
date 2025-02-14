import {
  MedusaRequest,
    AuthenticatedMedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { BLOG_MODULE } from "src/modules/blog"
import BlogModuleService from "src/modules/blog/service";
import Blogrequest from "../../../workflows/blog/types"
import multer from "multer";
  

 
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    limit,
    offset,
  } = req.validatedQuery || {}

  const queryOptions: any = {
    entity: "blog",
    fields: ["*"],
    pagination: {
      skip: offset,
    },
  }

  if (limit) {
    queryOptions.pagination.take = parseInt(limit as unknown as string, 10)
  }

  if (offset) {
    queryOptions.pagination.skip = parseInt(offset as unknown as string, 10)
  }


  const {
    data: blogs,
    metadata,
  } = await query.graph(queryOptions)

  res.json({
    blogs,
    count: metadata?.count,
    limit: metadata?.take,
    offset: metadata?.skip,
  })
}


export const POST = async (
  req: MedusaRequest<Blogrequest>,
  res: MedusaResponse
) => {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

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

    const blog = await blogModuleService.createBlogs({
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

    res.status(201).json({ blog })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


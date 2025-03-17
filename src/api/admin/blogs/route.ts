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
  

type ImageKey = 'thumbnail_image1' | 'thumbnail_image2' | 'thumbnail_image3';

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

    // Cast req.files to an object with the expected keys
    const filesObj = req.files as {
      thumbnail_image1?: Express.Multer.File[]
      thumbnail_image2?: Express.Multer.File[]
      thumbnail_image3?: Express.Multer.File[]
    }

    // Build an array mapping each expected field to its file (if provided)
    const fileFields: Array<{ field: ImageKey; file: Express.Multer.File }> = []
    if (filesObj.thumbnail_image1 && filesObj.thumbnail_image1.length > 0) {
      fileFields.push({ field: 'thumbnail_image1', file: filesObj.thumbnail_image1[0] })
    }
    if (filesObj.thumbnail_image2 && filesObj.thumbnail_image2.length > 0) {
      fileFields.push({ field: 'thumbnail_image2', file: filesObj.thumbnail_image2[0] })
    }
    if (filesObj.thumbnail_image3 && filesObj.thumbnail_image3.length > 0) {
      fileFields.push({ field: 'thumbnail_image3', file: filesObj.thumbnail_image3[0] })
    }

    // Throw an error if no files were uploaded
    if (fileFields.length === 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No files were uploaded"
      )
    }

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
      tags
    } = req.body

    // Upload files using your workflow
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: fileFields.map(({ file }) => ({
          filename: file.originalname,
          mimeType: file.mimetype,
          content: file.buffer.toString("binary"),
          access: "public",
        })),
      },
    })

    // Create an object to store the URLs based on the thumbnail keys.
    const uploadedImages: Record<ImageKey, string | null> = {
      thumbnail_image1: null,
      thumbnail_image2: null,
      thumbnail_image3: null,
    }

    // Map each upload result back to its corresponding field
    fileFields.forEach((item, idx) => {
      if (result[idx] && result[idx].url) {
        uploadedImages[item.field] = result[idx].url
      }
    })

    const uploadedTags = tags ? tags.split(',') : []

    // Create the blog entry with all provided fields and the uploaded image URLs.
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
      thumbnail_image1: uploadedImages.thumbnail_image1,
      thumbnail_image2: uploadedImages.thumbnail_image2,
      thumbnail_image3: uploadedImages.thumbnail_image3,
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



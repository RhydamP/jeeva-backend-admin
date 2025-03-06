import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import BlogRequest from "src/workflows/blog/types";

type BlogResponse = { 
  blogs: Array<BlogRequest>; 
  count: number; 
  limit: number; 
  offset: number; 
}

export const GET = async (
  req: MedusaRequest<BlogResponse>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const limit = parseInt(req.query.limit as string) || 10
  const offset = parseInt(req.query.offset as string) || 0


  const queryOptions = {
    entity: "blog",
    fields: ['id','author','thumbnail_image1','description','title'],
    pagination: {
        skip: offset,
        take: limit,
      },
  }

  try {
    const { data: blogs, metadata} = await query.graph({
      ...queryOptions,
      ...req.queryConfig,
    })

    res.json({
      blogs,
      count: metadata?.count,
      limit: metadata?.take,
      offset: metadata?.skip
    })
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the blogs" })
  }
}
export const AUTHENTICATE = false;
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";

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
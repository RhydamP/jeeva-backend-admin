import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_MODULE } from "src/modules/blog"
import BlogModuleService from "src/modules/blog/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const blogService:BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const blogs = await blogService.listBlogs()
  res.json({ blogs })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
      // Validate the request body.
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is empty" });
      }
  
      const blogService:BlogModuleService = req.scope.resolve(BLOG_MODULE);
      const blog = await blogService.createBlogs(req.body);
      
      return res.status(200).json({ blog });
    } catch (error: any) {
      console.error("Error creating blog:", error);
      return res.status(400).json({ error: error.message || "An error occurred" });
    }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const blogService:BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const blog = await blogService.updateBlogs(req.body)
  res.json({ blog })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const blogService:any = req.scope.resolve(BLOG_MODULE)
  const blog = await blogService.deleteBlogs(req.body)
  res.json({ blog })
}
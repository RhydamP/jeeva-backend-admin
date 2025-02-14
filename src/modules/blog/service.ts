import { MedusaService } from "@medusajs/framework/utils"
import Blog from "./models/blog"

class BlogModuleService extends MedusaService({
  Blog,
}){}

export default BlogModuleService
  import { 
    defineMiddlewares,
    authenticate,
  } from "@medusajs/framework/http"
  import multer from "multer"
  const upload = multer({ storage: multer.memoryStorage() })
   
  export default defineMiddlewares({
    routes: [
      {
        matcher: "/admin/blogs*",
        middlewares: [
          authenticate("user", ["session", "bearer", "api-key"]),
          upload.array("files"),
        ],
      },  
      {
        matcher: "/vendors/*",
        middlewares: [
          authenticate("vendor", ["session", "bearer"]),
        ],
      },
    ],
  })
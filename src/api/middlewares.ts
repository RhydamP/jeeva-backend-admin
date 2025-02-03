import { 
    defineMiddlewares,
    authenticate,
  } from "@medusajs/framework/http"
  
  export default defineMiddlewares({
    routes: [
      {
        matcher: "/vendors",
        method: "POST",
        middlewares: [
          authenticate("vendor", ["session", "bearer"], {
            allowUnregistered: true,
          }),
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
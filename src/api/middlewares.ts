import {
  defineMiddlewares,
  authenticate,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import multer from "multer"
import cors from "cors"
import { ConfigModule } from "@medusajs/framework/types"
import { parseCorsOrigins } from "@medusajs/framework/utils"

const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/blogs*",
      middlewares: [
        (
          req: MedusaRequest,
          res: MedusaResponse,
          next: MedusaNextFunction
        ) => {
          const configModule: ConfigModule = req.scope.resolve("configModule")
          return cors({
            origin: parseCorsOrigins(
              configModule.projectConfig.http.adminCors
            ),
            credentials: true,
          })(req, res, next)
        },
        //authenticate("user", ["session", "bearer", "api-key"]),
        upload.fields([
          { name: 'thumbnail_image1', maxCount: 1 },
          { name: 'thumbnail_image2', maxCount: 1 },
          { name: 'thumbnail_image3', maxCount: 1 }
        ]),
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
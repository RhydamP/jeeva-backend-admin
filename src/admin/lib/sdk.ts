import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "http://3.110.193.84:9000",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})

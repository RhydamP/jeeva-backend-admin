// src/workflows/login-admin.ts

import { 
    createWorkflow, 
    WorkflowResponse, 
    createStep,
    StepResponse
  } from "@medusajs/framework/workflows-sdk"
  import { Modules, MedusaError } from "@medusajs/framework/utils"
  import { AuthenticationInput } from "@medusajs/framework/types"
  
  export type LoginInput = {
    email: string
    password: string
  }
  
  const loginAdminStep = createStep(
    "login-admin",
    async (input: LoginInput, { container }) => {
      const authModuleService = container.resolve(Modules.AUTH)
      const { success, authIdentity, error } = await authModuleService
        .authenticate(
          "emailpass",
          {
            email: input.email,
            password: input.password,
            authScope: "admin"
          } as AuthenticationInput
        )
  
      if (!success) {
        throw new MedusaError(
          MedusaError.Types.UNAUTHORIZED,
          error || "Incorrect authentication details"
        )
      }
  
      return new StepResponse({ authIdentity })
    }
  )
  
  export const loginAdminWorkflow = createWorkflow(
    "login-admin",
    (input: LoginInput) => {
      const { authIdentity } = loginAdminStep(input)
  
      return new WorkflowResponse({
        authIdentity,
      })
    }
  )
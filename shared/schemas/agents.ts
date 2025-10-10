import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";


export const agentsInitialValues = {
  name: "",
  modelId: "",
  code: "",
  url: "",
  tenantId: "",
  monthlyTokenLimit: 0,
  description: "",
  abilities: [] as string[],
  personality: "",
};

export const agentsValidationSchema = Yup.object({
  name: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  modelId: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  code: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  url: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  tenantId: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  monthlyTokenLimit: Yup.number().required(FIELD_REQUIRED_MESSAGE),
  description: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  abilities: Yup.array().required(FIELD_REQUIRED_MESSAGE),
  personality: Yup.string().required(FIELD_REQUIRED_MESSAGE),
});
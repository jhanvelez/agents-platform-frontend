import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";

export const modelsInitialValues = {
  name: "",
  provider: "",
  version: "",
  type: "",
  parameters: "",
  isActive: true,
};

export const modelsValidationSchema = Yup.object({
  name: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  provider: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  version: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  type: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  parameters: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  isActive: Yup.boolean().required(FIELD_REQUIRED_MESSAGE),
});

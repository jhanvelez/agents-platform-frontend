import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";


export const tokensUsageInitialValues = {
  tokens: "",
};

export const tokensUsageValidationSchema = Yup.object({
  tokens: Yup.number().required(FIELD_REQUIRED_MESSAGE),
});
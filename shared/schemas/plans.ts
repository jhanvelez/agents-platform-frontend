import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";


export const plansInitialValues = {
  name: "",
  maxAgents: undefined,
  maxConsultsPerMonth: undefined,
  monthlyTokenLimit: undefined,
};

export const plansValidationSchema = Yup.object({
  name: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  maxAgents: Yup.number().required(FIELD_REQUIRED_MESSAGE),
  maxConsultsPerMonth: Yup.number().required(FIELD_REQUIRED_MESSAGE),
  monthlyTokenLimit: Yup.number().required(FIELD_REQUIRED_MESSAGE),
});
import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";


export const agentsInitialValues = {
  name: "",
  model: "",
  url: "",
  tenantId: "",
  monthlyTokenLimit: 0,
  description: "",
  abilities: [] as string[],
  personality: "",
};

export const agentsValidationSchema = Yup.object({
  name: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  model: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  url: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  tenantId: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  monthlyTokenLimit: Yup.number().required(FIELD_REQUIRED_MESSAGE),
  description: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  abilities: Yup.array().required(FIELD_REQUIRED_MESSAGE),
  personality: Yup.string().required(FIELD_REQUIRED_MESSAGE),
});

/*
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsUUID()
  tenantId: string;

  @IsInt()
  @Min(0)
  monthlyTokenLimit: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  abilities?: string;

  @IsOptional()
  @IsString()
  personality?: string;
*/
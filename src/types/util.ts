import {
  ZodErrorMap,
  ZodFirstPartyTypeKind as OriginalFirstPartyTypeKind,
  ZodFirstPartyTypeKind,
} from "zod";
export type RawCreateParams =
  | {
      errorMap?: ZodErrorMap;
      invalid_type_error?: string;
      required_error?: string;
      description?: string;
    }
  | undefined;

export type ProcessedCreateParams = {
  errorMap?: ZodErrorMap;
  description?: string;
};

export function processCreateParams(
  params: RawCreateParams
): ProcessedCreateParams {
  if (!params) return {};
  const { errorMap, invalid_type_error, required_error, description } = params;
  if (errorMap && (invalid_type_error || required_error)) {
    throw new Error(
      `Can't use "invalid" or "required" in conjunction with custom error map.`
    );
  }
  if (errorMap) return { errorMap: errorMap, description };
  const customMap: ZodErrorMap = (iss, ctx) => {
    if (iss.code !== "invalid_type") return { message: ctx.defaultError };
    if (typeof ctx.data === "undefined" && required_error)
      return { message: required_error };
    if (params.invalid_type_error)
      return { message: params.invalid_type_error };
    return { message: ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

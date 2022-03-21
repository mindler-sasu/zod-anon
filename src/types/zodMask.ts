import {
  ParseInput,
  ParseReturnType,
  ParseStatus,
  ZodType,
  ZodTypeDef,
} from "zod";
import { errorUtil } from "zod/lib/helpers/errorUtil";

import { RawCreateParams, processCreateParams } from "./util";

type ZodMaskCheck =
  | {
      kind: "offset";
      value?: any;
      message?: string;
    }
  | { kind: "char"; value: any; message?: string };

export interface ZodMaskDef extends ZodTypeDef {
  checks: ZodMaskCheck[];
  typeName: "ZodMask";
}
const maskF = (inputString, maskFrom, maskChar) => {
  const masked = inputString
    .slice(maskFrom, inputString.length)
    .replace(/./g, maskChar);

  return inputString.slice(0, maskFrom) + masked;
};
export class ZodMask extends ZodType<string, ZodMaskDef> {
  _parse(input: ParseInput): ParseReturnType<string> {
    const parsedType = this._getType(input);
    let maskFrom = 0;
    let maskChar = "*";
    const inputString = `${input.data}`;
    let maskedValue = undefined;

    const status = new ParseStatus();

    for (const check of this._def.checks) {
      if (check.kind === "offset") {
        maskFrom = check.value;
        if (check.value > inputString.length)
          throw Error("Can't offset more than input length");
      }
      if (check.kind === "char") {
        maskChar = check.value;
      }
    }
    if (!maskedValue) {
      maskedValue = maskF(inputString, maskFrom, maskChar);
    }

    return { status: status.value, value: maskedValue };
  }

  _addCheck(check: ZodMaskCheck) {
    return new ZodMask({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  offset(offset: number, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "offset",
      value: offset,
      ...errorUtil.errToObj(message),
    });
  }
  char(maskchar: any, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "char",
      value: maskchar,
      ...errorUtil.errToObj(message),
    });
  }

  static create = (params?: RawCreateParams): ZodMask => {
    return new ZodMask({
      checks: [],
      typeName: "ZodMask",
      ...processCreateParams(params),
    });
  };
}

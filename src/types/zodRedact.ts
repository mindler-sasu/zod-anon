import {
  ParseInput,
  ParseReturnType,
  ParseStatus,
  ZodType,
  ZodTypeDef,
} from "zod";
import { errorUtil } from "zod/lib/helpers/errorUtil";

import { RawCreateParams, processCreateParams } from "./util";

type ZodRedactCheck = { kind: "replacement"; value: any; message?: string };

export interface ZodRedactDef extends ZodTypeDef {
  checks: ZodRedactCheck[];
  typeName: "ZodRedact";
}

export class ZodRedact extends ZodType<string, ZodRedactDef> {
  _parse(input: ParseInput): ParseReturnType<string> {
    const parsedType = this._getType(input);

    let redactValue = "<REDACTED>";

    const status = new ParseStatus();

    for (const check of this._def.checks) {
      if (check.kind === "replacement") {
        redactValue = check.value;
      }
    }

    return { status: status.value, value: redactValue };
  }

  _addCheck(check: ZodRedactCheck) {
    return new ZodRedact({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  replacement(replacement: any, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "replacement",
      value: replacement,
      ...errorUtil.errToObj(message),
    });
  }

  static create = (params?: RawCreateParams): ZodRedact => {
    return new ZodRedact({
      checks: [],
      typeName: "ZodRedact",
      ...processCreateParams(params),
    });
  };
}

import {
  ParseInput,
  ParseReturnType,
  ParseStatus,
  ZodType,
  ZodTypeDef,
} from "zod";
import { createHmac, randomBytes } from "crypto";

import { RawCreateParams, processCreateParams } from "./util";
import { errorUtil } from "zod/lib/helpers/errorUtil";

type ZodHashCheck = {
  kind: "secret";
  value: string;
  message?: string;
};

export interface ZodHashDef extends ZodTypeDef {
  checks: ZodHashCheck[];
  typeName: "ZodHash";
}

export class ZodHash extends ZodType<string, ZodHashDef> {
  _parse(input: ParseInput): ParseReturnType<string> {
    const parsedType = this._getType(input);

    let originalValue = input.data;

    const status = new ParseStatus();
    let hashedValue = createHmac("sha256", randomBytes(64).toString("hex"))
      .update(originalValue)
      .digest("hex");

    for (const check of this._def.checks) {
      switch (check.kind) {
        case "secret": {
          hashedValue = createHmac("sha256", check.value)
            .update(originalValue)
            .digest("hex");
          break;
        }
      }
    }
    return { status: status.value, value: hashedValue };
  }
  _addCheck(check: ZodHashCheck) {
    return new ZodHash({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  secret(secret: string, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "secret",
      value: secret,
      ...errorUtil.errToObj(message),
    });
  }

  static create = (params?: RawCreateParams): ZodHash => {
    return new ZodHash({
      checks: [],
      typeName: "ZodHash",
      ...processCreateParams(params),
    });
  };
}

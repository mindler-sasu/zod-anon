import { faker } from "@faker-js/faker";

import {
  ParseInput,
  ParseReturnType,
  ParseStatus,
  ZodType,
  ZodTypeDef,
} from "zod";
import { errorUtil } from "zod/lib/helpers/errorUtil";

import { RawCreateParams, processCreateParams } from "./util";
type ZodFakerCheck =
  | { kind: "name"; message?: string }
  | { kind: "address"; message?: string }
  | { kind: "phone"; format?: string; message?: string }
  | { kind: "lorem"; scope?: "sentence" | "lines" | "paragraph" | "word" };

export interface ZodFakerDef extends ZodTypeDef {
  checks: ZodFakerCheck[];
  typeName: "ZodFaker";
}
export class ZodFaker extends ZodType<string | number, ZodFakerDef> {
  _parse(input: ParseInput): ParseReturnType<string> {
    const parsedType = this._getType(input);

    let fakedValue = input.data;

    const status = new ParseStatus();

    for (const check of this._def.checks) {
      switch (check.kind) {
        case "name": {
          fakedValue = faker[check.kind].findName();
          break;
        }
        case "address": {
          fakedValue = faker[check.kind].streetAddress();
          break;
        }
        case "address": {
          fakedValue = faker[check.kind].streetAddress();
          break;
        }
        case "phone": {
          fakedValue = faker[check.kind].phoneNumber(check.format);
          break;
        }
        case "lorem": {
          fakedValue = check.scope
            ? faker[check.kind][check.scope]()
            : faker[check.kind].sentence();
          break;
        }
      }
    }

    return { status: status.value, value: fakedValue };
  }

  _addCheck(check: ZodFakerCheck) {
    return new ZodFaker({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  name(message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "name",
      ...errorUtil.errToObj(message),
    });
  }
  address(message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "address",
      ...errorUtil.errToObj(message),
    });
  }
  phone(format?: string, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "phone",
      format: format,
      ...errorUtil.errToObj(message),
    });
  }
  lorem(
    scope?: "sentence" | "lines" | "paragraph" | "word",
    message?: errorUtil.ErrMessage
  ) {
    return this._addCheck({
      kind: "lorem",
      scope,
      ...errorUtil.errToObj(message),
    });
  }

  static create = (params?: RawCreateParams): ZodFaker => {
    return new ZodFaker({
      checks: [],
      typeName: "ZodFaker",
      ...processCreateParams(params),
    });
  };
}

import {
  ParseInput,
  ParseReturnType,
  ParseStatus,
  ZodType,
  ZodTypeDef,
} from "zod";

import { RawCreateParams, processCreateParams } from "./util";
import { errorUtil } from "zod/lib/helpers/errorUtil";
type ZodFuzzNumberCheck =
  | {
      kind: "int";
      value: number;
      message?: string;
    }
  | {
      kind: "float";
      value: number;
      precision: number;
      message?: string;
    };

export interface ZodFuzzNumberDef extends ZodTypeDef {
  checks: ZodFuzzNumberCheck[];
  typeName: "ZodFuzzNumber";
}
function getRandomValue(from: number, to: number) {
  return from + Math.random() * (to - from);
}

export class ZodFuzzNumber extends ZodType<number, ZodFuzzNumberDef> {
  _parse(input: ParseInput): ParseReturnType<number> {
    const parsedType = this._getType(input);

    let originalNumber = input.data;

    const status = new ParseStatus();
    let fuzzedValue = originalNumber;
    for (const check of this._def.checks) {
      switch (check.kind) {
        case "int": {
          fuzzedValue = Math.round(
            getRandomValue(
              originalNumber + -check.value,
              originalNumber + check.value
            )
          );
          break;
        }
        case "float": {
          fuzzedValue = getRandomValue(
            originalNumber + -check.value,
            originalNumber + check.value
          );
          if (check.precision) {
            fuzzedValue = +fuzzedValue.toFixed(check.precision);
          }
          break;
        }
      }
    }
    return { status: status.value, value: fuzzedValue };
  }
  _addCheck(check: ZodFuzzNumberCheck) {
    return new ZodFuzzNumber({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  int(range: number, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "int",
      value: range,
      ...errorUtil.errToObj(message),
    });
  }
  float(range: number, precision?: number, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "float",
      precision,
      value: range,
      ...errorUtil.errToObj(message),
    });
  }

  static create = (params?: RawCreateParams): ZodFuzzNumber => {
    return new ZodFuzzNumber({
      checks: [],
      typeName: "ZodFuzzNumber",
      ...processCreateParams(params),
    });
  };
}

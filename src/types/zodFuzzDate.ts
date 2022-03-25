import {
  ParseInput,
  ParseReturnType,
  ParseStatus,
  ZodType,
  ZodTypeDef,
} from "zod";

import { RawCreateParams, processCreateParams, Duration } from "./util";
import { errorUtil } from "zod/lib/helpers/errorUtil";
type ZodFuzzDateCheck =
  | {
      kind: "range";
      value: Duration;
      message?: string;
    }
  | {
      kind: "toISOString";
      message?: string;
    };

export interface ZodFuzzDateDef extends ZodTypeDef {
  checks: ZodFuzzDateCheck[];
  typeName: "ZodFuzzDate";
}
function getRandomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

export class ZodFuzzDate extends ZodType<Date, ZodFuzzDateDef> {
  _parse(input: ParseInput): ParseReturnType<Date> {
    const parsedType = this._getType(input);

    let originalDateTime = new Date(input.data).getTime();

    const status = new ParseStatus();
    let fuzzedValue: Date | string = new Date(input.data);
    for (const check of this._def.checks) {
      switch (check.kind) {
        case "range": {
          const inputInMillis = check.value.toMilliseconds();
          fuzzedValue = getRandomDate(
            new Date(originalDateTime - inputInMillis),
            new Date(originalDateTime + inputInMillis)
          );
          break;
        }
        case "toISOString": {
          throw Error("nod imblemebt");
          break;
        }
      }
    }
    return { status: status.value, value: fuzzedValue };
  }
  _addCheck(check: ZodFuzzDateCheck) {
    return new ZodFuzzDate({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
  range(duration?: Duration, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "range",
      value: duration,
      ...errorUtil.errToObj(message),
    });
  }
  // toISOString(message?: errorUtil.ErrMessage) {
  //   return this._addCheck({
  //     kind: "toISOString",
  //     ...errorUtil.errToObj(message),
  //   });
  // }

  static create = (params?: RawCreateParams): ZodFuzzDate => {
    return new ZodFuzzDate({
      checks: [],
      typeName: "ZodFuzzDate",
      ...processCreateParams(params),
    });
  };
}

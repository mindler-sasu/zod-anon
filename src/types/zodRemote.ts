import {
  AsyncParseReturnType,
  ParseInput,
  ParseReturnType,
  ParseStatus,
  ZodType,
  ZodTypeDef,
} from "zod";
import { errorUtil } from "zod/lib/helpers/errorUtil";
import get from "lodash.get";
import { RawCreateParams, processCreateParams } from "./util";
import axios, { AxiosRequestConfig, Method } from "axios";
type ZodRemoteCheck =
  | {
      kind: "config";
      request: AxiosRequestConfig;
      message?: string;
    }
  | { kind: "responsePath"; value: any; message?: string };

export interface ZodRemoteDef extends ZodTypeDef {
  checks: ZodRemoteCheck[];
  typeName: "ZodRemote";
}

export class ZodRemote extends ZodType<string, ZodRemoteDef> {
  async _parse(input: ParseInput): AsyncParseReturnType<string> {
    const parsedType = this._getType(input);

    const status = new ParseStatus();

    let requestConfig;
    let responseValue = input.data;
    let responsePath;
    for (const check of this._def.checks) {
      if (check.kind === "config") {
        requestConfig = check.request;
      }
      if (check.kind === "responsePath") {
        responsePath = check.value;
      }
    }
    const res = await axios.request(requestConfig);
    responseValue = res.data;

    if (responsePath) {
      responseValue = get(res.data, responsePath);
    }

    return { status: status.value, value: responseValue };
  }

  _addCheck(check: ZodRemoteCheck) {
    return new ZodRemote({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }

  config(request: any, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "config",
      request,
      ...errorUtil.errToObj(message),
    });
  }
  responsePath(value: string, message?: errorUtil.ErrMessage) {
    return this._addCheck({
      kind: "responsePath",
      value,
      ...errorUtil.errToObj(message),
    });
  }

  static create = (params?: RawCreateParams): ZodRemote => {
    return new ZodRemote({
      checks: [],
      typeName: "ZodRemote",
      ...processCreateParams(params),
    });
  };
}

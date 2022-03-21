import { ZodString } from "./types/zodString";
import { ZodRedact } from "./types/zodRedact";
import { ZodFaker } from "./types/zodFaker";
import { ZodMask } from "./types/zodMask";
import { ZodRemote } from "./types/zodRemote";

const stringType = ZodString.create;
const redactType = ZodRedact.create;
const fakerType = ZodFaker.create;
const maskType = ZodMask.create;
const remoteType = ZodRemote.create;
export {
  stringType as string,
  redactType as redact,
  fakerType as faker,
  maskType as mask,
  remoteType as remote,
};

import { ZodString } from "./types/zodString";
import { ZodRedact } from "./types/zodRedact";
import { ZodFaker } from "./types/zodFaker";
import { ZodMask } from "./types/zodMask";

const stringType = ZodString.create;
const redactType = ZodRedact.create;
const fakerType = ZodFaker.create;
const maskType = ZodMask.create;
export {
  stringType as string,
  redactType as redact,
  fakerType as faker,
  maskType as mask,
};

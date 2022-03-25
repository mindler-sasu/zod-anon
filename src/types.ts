import { ZodRedact } from "./types/zodRedact";
import { ZodFaker } from "./types/zodFaker";
import { ZodMask } from "./types/zodMask";
import { ZodRemote } from "./types/zodRemote";
import { ZodFuzzDate } from "./types/zodFuzzDate";
import { ZodFuzzNumber } from "./types/zodFuzzNumber";
import { ZodHash } from "./types/zodHash";

const redactType = ZodRedact.create;
const fakerType = ZodFaker.create;
const maskType = ZodMask.create;
const remoteType = ZodRemote.create;
const fuzzDateType = ZodFuzzDate.create;
const fuzzNumberType = ZodFuzzNumber.create;
const zodHashType = ZodHash.create;

export {
  redactType as redact,
  fakerType as faker,
  maskType as mask,
  remoteType as remote,
  fuzzDateType as fuzzDate,
  fuzzNumberType as fuzzNumber,
  zodHashType as hash,
};

import { ZodString } from "./types/zodString";
import { ZodRedact } from "./types/zodRedact";
import { ZodFaker } from "./types/zodFaker";

const stringType = ZodString.create;
const redactType = ZodRedact.create;
const fakerType = ZodFaker.create;

export { stringType as string, redactType as redact, fakerType as faker };

import { z as zorg } from "zod";
import * as mod from "./types";
import * as dur from "./types/util";
export const z = {
  ...zorg,
  ...mod,
};
export const Duration = dur.Duration;

import { z as zorg } from "zod";
import * as mod from "./types";
export const z = {
  ...zorg,
  ...mod,
};

import { z } from "../index";

describe("redact", () => {
  it("should redact", async () => {
    const anonSchema = z.object({
      name: z.redact(),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "<REDACTED>" });
  });

  it("should redact with given parameter value", () => {
    const anonSchema = z.object({
      name: z.redact().replacement("XXXXXX"),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "XXXXXX" });
  });
});

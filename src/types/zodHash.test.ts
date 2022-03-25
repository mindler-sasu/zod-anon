import { z } from "../index";

describe("FuzzNumber", () => {
  it("should random hash", async () => {
    const anonSchema = z.object({
      ssn: z.hash(),
    });
    const ogssn = "1230435-334X";
    const anonymized = anonSchema.parse({ ssn: ogssn });
    const anonymized2 = anonSchema.parse({ ssn: ogssn });
    expect(anonymized.ssn).not.toEqual(ogssn);
    expect(anonymized.ssn).not.toEqual(anonymized2.ssn);
  });

  it("should hash with secret", async () => {
    const anonSchema = z.object({
      ssn: z.hash().secret("sekrit key"),
    });
    const ogssn = "1230435-334X";
    const anonymized = anonSchema.parse({ ssn: ogssn });
    const anonymized2 = anonSchema.parse({ ssn: ogssn });

    expect(anonymized.ssn).not.toEqual(ogssn);
    expect(anonymized.ssn).toEqual(anonymized2.ssn);
  });
});

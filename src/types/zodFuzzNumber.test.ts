import { z } from "../index";

describe("FuzzNumber", () => {
  it("should fuzz integer", async () => {
    const anonSchema = z.object({
      year: z.fuzzNumber().int(1000),
    });
    const ogtime = 1942;
    const anonymized = anonSchema.parse({ year: ogtime });

    expect(anonymized.year).not.toEqual(ogtime);
    expect(anonymized.year).toBeGreaterThan(ogtime - 1000);
    expect(anonymized.year).toBeLessThan(ogtime + 1000);
  });
  it("should fuzz integer close", async () => {
    const anonSchema = z.object({
      year: z.fuzzNumber().int(1),
    });
    const ogtime = 1942;
    const anonymized = anonSchema.parse({ year: ogtime });

    expect(
      anonymized.year === 1941 ||
        anonymized.year === 1942 ||
        anonymized.year === 1943
    ).toBeTruthy();
  });
  it("should fuzz float", async () => {
    const anonSchema = z.object({
      pi: z.fuzzNumber().float(0.5),
    });
    const pi = Math.PI;
    const anonymized = anonSchema.parse({ pi });

    expect(pi).not.toEqual(anonymized.pi);
    expect(anonymized.pi).toBeGreaterThan(pi - 0.51);
    expect(anonymized.pi).toBeLessThan(pi + 0.51);
  });
  it("should fuzz float with precision", async () => {
    const anonSchema = z.object({
      pi: z.fuzzNumber().float(0.5, 2),
    });
    const pi = Math.PI;
    const anonymized = anonSchema.parse({ pi });

    expect(pi).not.toEqual(anonymized.pi);
    expect(anonymized.pi).toBeGreaterThan(pi - 0.51);
    expect(anonymized.pi).toBeLessThan(pi + 0.51);
    expect(String(anonymized.pi).length).toBeLessThanOrEqual(4);
  });
});

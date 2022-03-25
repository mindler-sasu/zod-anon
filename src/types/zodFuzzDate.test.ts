import { z, Duration } from "../index";

describe("FuzzDate", () => {
  it("should fuzz data from within seconds", async () => {
    const anonSchema = z.object({
      birthday: z.fuzzDate().range(Duration.seconds(2)),
    });
    const ogtime = new Date("1995/12/20");
    const anonymized = anonSchema.parse({ birthday: ogtime });

    expect(anonymized.birthday.getTime()).not.toEqual(ogtime.getTime());
    expect(anonymized.birthday.getTime()).toBeGreaterThan(
      ogtime.getTime() - 2001
    );
    expect(anonymized.birthday.getTime()).toBeLessThan(ogtime.getTime() + 2001);
  });

  it("should fuzz data from within a month", async () => {
    const anonSchema = z.object({
      birthday: z.fuzzDate().range(Duration.days(30)),
    });
    const ogtime = new Date("1995/12/20");
    const anonymized = anonSchema.parse({ birthday: ogtime });

    expect(anonymized.birthday.getTime()).not.toEqual(ogtime.getTime());
    expect(anonymized.birthday.getTime()).toBeGreaterThan(
      ogtime.getTime() - 2.592e9
    );
    expect(anonymized.birthday.getTime()).toBeLessThan(
      ogtime.getTime() + 2.592e9
    );
  });
  it("should fuzz data from within a year", async () => {
    const anonSchema = z.object({
      birthday: z.fuzzDate().range(Duration.days(30)),
    });
    const ogtime = new Date("1995/12/20");
    const anonymized = anonSchema.parse({ birthday: ogtime });

    expect(anonymized.birthday.getTime()).not.toEqual(ogtime.getTime());
    expect(anonymized.birthday.getTime()).toBeGreaterThan(
      ogtime.getTime() - 3.156e10
    );
    expect(anonymized.birthday.getTime()).toBeLessThan(
      ogtime.getTime() + 3.156e10
    );
  });
});

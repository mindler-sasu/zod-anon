import { ZodErrorMap } from "zod";
export type RawCreateParams =
  | {
      errorMap?: ZodErrorMap;
      invalid_type_error?: string;
      required_error?: string;
      description?: string;
    }
  | undefined;

export type ProcessedCreateParams = {
  errorMap?: ZodErrorMap;
  description?: string;
};

export function processCreateParams(
  params: RawCreateParams
): ProcessedCreateParams {
  if (!params) return {};
  const { errorMap, invalid_type_error, required_error, description } = params;
  if (errorMap && (invalid_type_error || required_error)) {
    throw new Error(
      `Can't use "invalid" or "required" in conjunction with custom error map.`
    );
  }
  if (errorMap) return { errorMap: errorMap, description };
  const customMap: ZodErrorMap = (iss, ctx) => {
    if (iss.code !== "invalid_type") return { message: ctx.defaultError };
    if (typeof ctx.data === "undefined" && required_error)
      return { message: required_error };
    if (params.invalid_type_error)
      return { message: params.invalid_type_error };
    return { message: ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class TimeUnit {
  public static readonly Milliseconds = new TimeUnit("millis", "", 1);
  public static readonly Seconds = new TimeUnit("seconds", "S", 1_000);
  public static readonly Minutes = new TimeUnit("minutes", "M", 60_000);
  public static readonly Hours = new TimeUnit("hours", "H", 3_600_000);
  public static readonly Days = new TimeUnit("days", "D", 86_400_000);

  private constructor(
    public readonly label: string,
    public readonly isoLabel: string,
    public readonly inMillis: number
  ) {
    // MAX_SAFE_INTEGER is 2^53, so by representing our duration in millis (the lowest
    // common unit) the highest duration we can represent is
    // 2^53 / 86*10^6 ~= 104 * 10^6 days (about 100 million days).
  }

  public toString() {
    return this.label;
  }
}

// aws-cdk Duration library stuff
export interface TimeConversionOptions {
  /**
   * If `true`, conversions into a larger time unit (e.g. `Seconds` to `Minutes`) will fail if the result is not an
   * integer.
   *
   * @default true
   */
  readonly integral?: boolean;
}
function convert(
  amount: number,
  fromUnit: TimeUnit,
  toUnit: TimeUnit,
  { integral = true }: TimeConversionOptions
) {
  if (fromUnit.inMillis === toUnit.inMillis) {
    return amount;
  }

  const value = (amount * fromUnit.inMillis) / toUnit.inMillis;
  if (!Number.isInteger(value) && integral) {
    throw new Error(
      `'${amount} ${fromUnit}' cannot be converted into a whole number of ${toUnit}.`
    );
  }
  return value;
}
export class Duration {
  /**
   * Create a Duration representing an amount of milliseconds
   *
   * @param amount the amount of Milliseconds the `Duration` will represent.
   * @returns a new `Duration` representing `amount` ms.
   */
  public static millis(amount: number): Duration {
    return new Duration(amount, TimeUnit.Milliseconds);
  }

  /**
   * Create a Duration representing an amount of seconds
   *
   * @param amount the amount of Seconds the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Seconds.
   */
  public static seconds(amount: number): Duration {
    return new Duration(amount, TimeUnit.Seconds);
  }

  /**
   * Create a Duration representing an amount of minutes
   *
   * @param amount the amount of Minutes the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Minutes.
   */
  public static minutes(amount: number): Duration {
    return new Duration(amount, TimeUnit.Minutes);
  }

  /**
   * Create a Duration representing an amount of hours
   *
   * @param amount the amount of Hours the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Hours.
   */
  public static hours(amount: number): Duration {
    return new Duration(amount, TimeUnit.Hours);
  }

  /**
   * Create a Duration representing an amount of days
   *
   * @param amount the amount of Days the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Days.
   */
  public static days(amount: number): Duration {
    return new Duration(amount, TimeUnit.Days);
  }
  private readonly amount: number;
  private readonly unit: TimeUnit;

  private constructor(amount: number, unit: TimeUnit) {
    if (amount < 0) {
      throw new Error(
        `Duration amounts cannot be negative. Received: ${amount}`
      );
    }

    this.amount = amount;
    this.unit = unit;
  }
  public toMilliseconds(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Milliseconds, opts);
  }
  public toIsoString(): string {
    if (this.amount === 0) {
      return "PT0S";
    }

    const ret = ["P"];
    let tee = false;

    for (const [amount, unit] of this.components(true)) {
      if (
        [TimeUnit.Seconds, TimeUnit.Minutes, TimeUnit.Hours].includes(unit) &&
        !tee
      ) {
        ret.push("T");
        tee = true;
      }
      ret.push(`${amount}${unit.isoLabel}`);
    }

    return ret.join("");
  }
  private components(
    combineMillisWithSeconds: boolean
  ): Array<[number, TimeUnit]> {
    const ret = new Array<[number, TimeUnit]>();
    let millis = convert(this.amount, this.unit, TimeUnit.Milliseconds, {
      integral: false,
    });

    for (const unit of [
      TimeUnit.Days,
      TimeUnit.Hours,
      TimeUnit.Minutes,
      TimeUnit.Seconds,
    ]) {
      const count = convert(millis, TimeUnit.Milliseconds, unit, {
        integral: false,
      });
      // Round down to a whole number UNLESS we're combining millis and seconds and we got to the seconds
      const wholeCount =
        unit === TimeUnit.Seconds && combineMillisWithSeconds
          ? count
          : Math.floor(count);
      if (wholeCount > 0) {
        ret.push([wholeCount, unit]);
        millis -= wholeCount * unit.inMillis;
      }
    }

    // Remainder in millis
    if (millis > 0) {
      ret.push([millis, TimeUnit.Milliseconds]);
    }
    return ret;
  }
}

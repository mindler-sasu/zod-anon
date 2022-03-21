import { z } from "../index";

describe("mask", () => {
  it("should should mask", async () => {
    const anonSchema = z.object({
      name: z.mask(),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "*****" });
  });
  it("should should mask from", async () => {
    const anonSchema = z.object({
      name: z.mask().offset(1),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "E****" });
  });
  it("should should mask from 3", async () => {
    const anonSchema = z.object({
      name: z.mask().offset(3),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "Erk**" });
  });
  it("should should mask with char", async () => {
    const anonSchema = z.object({
      name: z.mask().char("X"),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "XXXXX" });
  });
  it("should should mask with char and offset", async () => {
    const anonSchema = z.object({
      name: z.mask().char("X").offset(3),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "ErkXX" });
  });
  it("should throw with too much offset", async () => {
    const anonSchema = z.object({
      name: z.mask().offset(6),
    });
    expect(() => anonSchema.parse({ name: "Erkki" })).toThrowError();
  });
});

import faker from "@faker-js/faker";
import { z } from "../index";

describe("faker", () => {
  beforeEach(() => {
    faker.seed(69);
  });
  it("should fake name", () => {
    const anonSchema = z.object({
      name: z.faker().name(),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });
    expect(anonymized).toEqual({
      name: "Guadalupe Mertz",
    });
  });
  it("should fake address", () => {
    const anonSchema = z.object({
      address: z.faker().address(),
    });
    const anonymized = anonSchema.parse({ address: "Paskapajunkuja 666" });

    expect(anonymized).toEqual({
      address: "48531 Kelley Square",
    });
  });
  it("should fake phone", () => {
    const anonSchema = z.object({
      phone: z.faker().phone(),
    });
    const anonymized = anonSchema.parse({ phone: "04066642069" });

    expect(anonymized).toEqual({
      phone: "(585) 417-8512",
    });
  });
  it("should fake phone with format", () => {
    const anonSchema = z.object({
      phone: z.faker().phone("+358-###-###"),
    });
    const anonymized = anonSchema.parse({ phone: "04066642069" });

    expect(anonymized).toEqual({
      phone: "+358-248-531",
    });
  });
  it("should fake lorem", () => {
    const anonSchema = z.object({
      sentence: z.faker().lorem(),
    });
    const anonymized = anonSchema.parse({ sentence: "I am sekrit text" });

    expect(anonymized).toEqual({
      sentence: "In consequatur mollitia aliquid neque.",
    });
  });
  it("should fake lorem word", () => {
    const anonSchema = z.object({
      sentence: z.faker().lorem("word"),
    });
    const anonymized = anonSchema.parse({ sentence: "I am sekrit text" });

    expect(anonymized).toEqual({
      sentence: "exercitationem",
    });
  });
  it("should fake lorem paragraph", () => {
    const anonSchema = z.object({
      sentence: z.faker().lorem("paragraph"),
    });
    const anonymized = anonSchema.parse({ sentence: "I am sekrit text" });

    expect(anonymized).toEqual({
      sentence:
        "Consequatur mollitia aliquid neque temporibus eos. Qui aliquam veniam odit nam inventore magnam. Et optio explicabo minus sit temporibus vitae beatae. Voluptatem voluptates quod distinctio.",
    });
  });
});

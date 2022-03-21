import faker from "@faker-js/faker";
import { z } from "../src/index";
import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";
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
describe("remote", () => {
  const server = setupServer(
    // Handles a POST /login request
    rest.get("https://api.example.com/pseudonymize", (req, res, ctx) => {
      return res(ctx.status(200), ctx.text("anondada"));
    }),
    rest.get("https://api.example.com/pseudonymizejson", (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ anonymized: { value: "anondada" } })
      );
    })
  );
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  it("should get text response", async () => {
    const serverConfig = { url: "https://api.example.com/pseudonymize" };

    const anonSchema = z.object({
      name: z.remote().config(serverConfig),
    });
    const anonymized = await anonSchema.parseAsync({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "anondada" });
  });
  it("should get json response", async () => {
    const serverConfig = { url: "https://api.example.com/pseudonymizejson" };

    const anonSchema = z.object({
      name: z.remote().config(serverConfig).responsePath("anonymized.value"),
    });
    const anonymized = await anonSchema.parseAsync({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "anondada" });
  });

  it("should redact with given parameter value", () => {
    const anonSchema = z.object({
      name: z.redact().replacement("XXXXXX"),
    });
    const anonymized = anonSchema.parse({ name: "Erkki" });

    expect(anonymized).toEqual({ name: "XXXXXX" });
  });
});
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
    console.log(anonymized);

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

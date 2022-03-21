import { z } from "../index";
import { setupServer } from "msw/node";
import { rest } from "msw";

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
});

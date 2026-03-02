import { defineConfig, Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.resolve(__dirname, "../src/collision-data.json");

function collisionSavePlugin(): Plugin {
  return {
    name: "collision-save",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/__load" && req.method === "GET") {
          const data = fs.readFileSync(DATA_PATH, "utf-8");
          res.setHeader("Content-Type", "application/json");
          res.end(data);
          return;
        }

        if (req.url === "/__save" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            fs.writeFileSync(DATA_PATH, body, "utf-8");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [collisionSavePlugin()],
  server: {
    fs: {
      allow: [".."],
    },
  },
});

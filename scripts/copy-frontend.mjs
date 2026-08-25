import { cpSync, mkdirSync, rmSync } from "fs";

rmSync("public", { recursive: true, force: true });
mkdirSync("public", { recursive: true });
cpSync("mern-client/dist", "public", { recursive: true });

import fs from "fs";
import path from "path";

const CLIENT_DIRS = ["src/components", "src/app"];
const SERVER_ONLY_VARS = [
  "AIRTABLE_API_KEY",
  "BASE_ID",
  "MEETING_TABLE_ID",
  "MEETING_VIEW_ID",
  "PROGRAM_OPTIONS_TABLE_ID",
  "EIR_BASE_ID",
  "EIR_PROFILE_TABLE_ID",
  "EIR_PROFILE_VIEW_ID",
  // Add more server-only env vars as needed
];

function getAllFiles(dir: string, files: string[] = []): string[] {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      files.push(fullPath);
    }
  });
  return files;
}

describe("No server-only env vars in client code", () => {
  CLIENT_DIRS.forEach((dir) => {
    if (!fs.existsSync(dir)) return;
    getAllFiles(dir).forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      if (content.includes('"use client"') || content.includes("'use client'")) {
        it(`${file} should not import env or use server-only process.env`, () => {
          expect(content).not.toMatch(/from ['"]\.?\/env['"]/);
          SERVER_ONLY_VARS.forEach((v) => {
            expect(content).not.toContain(`process.env.${v}`);
          });
        });
      }
    });
  });
}); 
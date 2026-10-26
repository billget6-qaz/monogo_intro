import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

// 開發階段先存本機檔案；正式上線若部署到 Cloudflare Pages（Edge）無法寫檔，
// 只需改寫這個檔案，換成 KV / D1 即可，呼叫端不用動。
const FILE = path.join(process.cwd(), "data", "waitlist.jsonl");

// 以台灣時間記錄，格式如 2026/10/26 15:03:11
function taipeiNow() {
  return new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Taipei" })
    .replaceAll("-", "/");
}

export async function addToWaitlist(email: string): Promise<"added" | "exists"> {
  let existing = "";
  try {
    existing = await readFile(FILE, "utf8");
  } catch {
    // 檔案尚未建立
  }

  const seen = existing
    .split("\n")
    .filter(Boolean)
    .some((line) => {
      try {
        return JSON.parse(line).email === email;
      } catch {
        return false;
      }
    });
  if (seen) return "exists";

  await mkdir(path.dirname(FILE), { recursive: true });
  await appendFile(FILE, JSON.stringify({ email, at: taipeiNow() }) + "\n");
  return "added";
}

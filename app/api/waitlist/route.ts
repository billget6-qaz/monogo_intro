// public: 開賣前的興趣名單登記，訪客無需登入；以輸入驗證、同源檢查與速率限制保護
import { z } from "zod";
import { addToWaitlist } from "@/lib/waitlist";

const schema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  website: z.string().max(200).optional(), // 蜜罐欄位：真人看不到，機器人會填
});

// 固定視窗速率限制（每個 IP 每分鐘 5 次）。
// 目前為單一行程的記憶體版本；上線到多實例環境時改用 Cloudflare KV。
const WINDOW_MS = 60_000;
const LIMIT = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  // 同源檢查：有帶 Origin 時必須與本站相同，不開放跨來源
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    let sameOrigin = false;
    try {
      sameOrigin = new URL(origin).host === host;
    } catch {
      sameOrigin = false;
    }
    if (!sameOrigin) return json({ error: "請求被拒絕" }, 403);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) return json({ error: "請求太頻繁，請稍後再試" }, 429);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "資料格式錯誤" }, 400);
  }
  if (raw.length > 2000) return json({ error: "資料過大" }, 413);

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ error: "資料格式錯誤" }, 400);
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) return json({ error: "請輸入有效的 Email" }, 400);

  // 蜜罐被填：假裝成功，不寫入
  if (parsed.data.website) return json({ ok: true });

  try {
    await addToWaitlist(parsed.data.email);
  } catch (err) {
    console.error("waitlist write failed", err); // 詳細錯誤只留在伺服器日誌
    return json({ error: "目前無法登記，請稍後再試" }, 500);
  }

  // 新增與已存在回傳相同結果，避免洩漏誰已登記
  return json({ ok: true });
}

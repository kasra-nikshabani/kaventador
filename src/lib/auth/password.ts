import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * هش و راستی‌آزمایی رمز عبور.
 *
 * از `scrypt` داخلی Node استفاده می‌شود، نه یک وابستگی تازه:
 *  • حافظه‌سخت است، پس حمله با کارت گرافیک را گران می‌کند.
 *  • بخشی از خود Node است؛ نه نصب بومی می‌خواهد نه به‌روزرسانی امنیتی
 *    وابسته به یک پکیج شخص ثالث.
 *
 * قالب ذخیره: `scrypt$N$نمک(hex)$هش(hex)`
 * پارامترها داخل خود رشته می‌آیند تا اگر روزی سخت‌تر شدند، هش‌های
 * قدیمی همچنان قابل راستی‌آزمایی بمانند.
 */

/* `promisify` اورلود چهارآرگومانی scrypt (با گزینه‌ها) را تایپ نمی‌کند،
   پس پوشش دستی می‌نویسیم. */
function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: { N: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

/** هزینه CPU/حافظه. ۲^۱۶ حدود ۶۴ مگابایت می‌خواهد. */
const COST = 16384;
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scryptAsync(plain.normalize("NFKC"), salt, KEY_LENGTH, {
    N: COST,
  });

  return `scrypt$${COST}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;

  const cost = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(cost) || cost <= 0) return false;

  let saltBuffer: Buffer;
  let expected: Buffer;
  try {
    saltBuffer = Buffer.from(parts[2], "hex");
    expected = Buffer.from(parts[3], "hex");
  } catch {
    return false;
  }

  const derived = await scryptAsync(plain.normalize("NFKC"), saltBuffer, expected.length, {
    N: cost,
  });

  /* مقایسه با زمان ثابت: مقایسه معمولی با === از روی زمان پاسخ لو
     می‌دهد که چند بایت اول درست بوده است. */
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

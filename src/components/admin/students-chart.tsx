import { Card } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

export interface ChartDatum {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
}

/**
 * نمودار میله‌ای افقی «دانشجویان هر دوره».
 *
 * تصمیم‌های طراحی:
 *  • تک‌سری است، پس یک رنگ (رنگ برند) و بدون راهنمای رنگ — عنوان
 *    نمودار خودش می‌گوید چه چیزی رسم شده است.
 *  • ساختار واقعی `<table>` است: صفحه‌خوان یک جدول داده معتبر می‌شنود
 *    و کاربر بینا میله می‌بیند. یعنی «نمای جدولی» رایگان به‌دست می‌آید.
 *  • محور و خطوط شبکه ندارد چون مقدار هر میله مستقیم کنارش نوشته شده.
 *  • میله از لبه راست (شروع محور در RTL) رشد می‌کند، پس گوشه گردِ
 *    انتهای داده سمت `end` است و سمت پایه صاف می‌ماند.
 */
export function StudentsChart({ data }: { data: ChartDatum[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-5">
      <table className="w-full border-collapse">
        <caption className="mb-5 text-start">
          <span className="block font-bold">دانشجویان هر دوره</span>
          <span className="text-muted mt-1 block text-sm">
            مجموع {formatNumber(total)} ثبت‌نام در {formatNumber(data.length)}{" "}
            دوره منتشرشده
          </span>
        </caption>

        <thead className="sr-only">
          <tr>
            <th scope="col">دوره</th>
            <th scope="col">تعداد دانشجو</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const percent = (item.value / max) * 100;

            return (
              <tr key={item.id} className="group align-middle">
                <th
                  scope="row"
                  className="text-muted w-40 max-w-40 truncate py-2 pe-4 text-start text-sm font-normal"
                  title={item.label}
                >
                  {item.label}
                </th>

                <td className="py-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="bg-surface-2 flex h-5 flex-1 items-center overflow-hidden rounded-[4px]"
                      aria-hidden="true"
                    >
                      <span
                        className="bg-primary group-hover:bg-primary-hover h-full rounded-e-[4px] transition-colors"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    {/* مقدار در نوک میله؛ متن با توکن متنی است نه رنگ داده. */}
                    <span className="text-foreground w-14 shrink-0 text-sm font-medium tabular-nums">
                      {formatNumber(item.value)}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

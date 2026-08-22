/**
 * رندر داده ساختاریافته.
 *
 * محتوا همیشه از سازنده‌های `lib/seo` می‌آید (نه ورودی کاربر)،
 * پس تزریق اسکریپت اینجا امن است.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

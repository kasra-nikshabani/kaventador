/**
 * بدنه مقاله.
 *
 * محتوا فعلاً متن ساده است و با خط خالی به پاراگراف تقسیم می‌شود.
 * عمداً از `dangerouslySetInnerHTML` استفاده نمی‌شود؛ وقتی به MDX
 * مهاجرت کردیم، فقط همین کامپوننت عوض می‌شود.
 */
export function ArticleBody({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-muted text-[1.0625rem] leading-9">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

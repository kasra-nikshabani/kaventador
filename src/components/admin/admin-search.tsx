"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button, Input, Select } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface AdminFilter {
  /** نام پارامتر در URL. */
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
}

export interface AdminSearchProps {
  placeholder: string;
  filters?: AdminFilter[];
  resultLabel: string;
}

/** جستجو و فیلتر جدول‌های پنل — وضعیت در URL نگه داشته می‌شود. */
export function AdminSearch({
  placeholder,
  filters = [],
  resultLabel,
}: AdminSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") ?? "";
  const hasFilters =
    Boolean(currentSearch) || filters.some((f) => searchParams.get(f.name));

  function apply(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        isPending && "opacity-70 transition-opacity",
      )}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("q");
          apply({ q: typeof value === "string" ? value.trim() : "" });
        }}
        className="flex min-w-64 flex-1 gap-2"
      >
        <div className="relative flex-1">
          <Search
            className="text-subtle pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4"
            aria-hidden="true"
          />
          <Input
            key={currentSearch}
            name="q"
            type="search"
            defaultValue={currentSearch}
            placeholder={placeholder}
            aria-label={placeholder}
            className="ps-10"
          />
        </div>
        <Button type="submit" variant="secondary">
          جستجو
        </Button>
      </form>

      {filters.map((filter) => (
        <div key={filter.name}>
          <label className="sr-only" htmlFor={`filter-${filter.name}`}>
            {filter.label}
          </label>
          <Select
            id={`filter-${filter.name}`}
            value={searchParams.get(filter.name) ?? ""}
            onChange={(event) => apply({ [filter.name]: event.target.value })}
            className="w-auto min-w-36"
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      ))}

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            startTransition(() => router.push(pathname, { scroll: false }))
          }
        >
          <X aria-hidden="true" />
          حذف فیلترها
        </Button>
      )}

      <p aria-live="polite" className="text-muted ms-auto text-sm">
        {resultLabel}
      </p>
    </div>
  );
}

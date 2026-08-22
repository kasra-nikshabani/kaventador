import { BookOpen, Clock, Star, Users } from "lucide-react";
import { Container } from "@/components/ui";
import {
  formatCompactNumber,
  formatNumber,
  formatRating,
} from "@/lib/utils";

export interface StatsProps {
  courseCount: number;
  studentCount: number;
  totalHours: number;
  averageRating: number;
}

export function Stats({
  courseCount,
  studentCount,
  totalHours,
  averageRating,
}: StatsProps) {
  const items = [
    { icon: BookOpen, value: formatNumber(courseCount), label: "دوره آموزشی" },
    { icon: Users, value: formatCompactNumber(studentCount), label: "دانشجو" },
    { icon: Clock, value: formatNumber(totalHours), label: "ساعت آموزش" },
    { icon: Star, value: formatRating(averageRating), label: "میانگین امتیاز" },
  ];

  return (
    <section aria-label="آمار کاوِنتادور" className="border-border border-b">
      <Container className="grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
              <item.icon className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl leading-tight font-black">
                {item.value}
              </span>
              <span className="text-muted text-sm">{item.label}</span>
            </span>
          </div>
        ))}
      </Container>
    </section>
  );
}

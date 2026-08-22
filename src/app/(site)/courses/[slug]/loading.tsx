import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="border-border bg-surface border-b">
      <Container className="py-10 sm:py-14">
        <Skeleton className="h-4 w-48" />
        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <Skeleton className="aspect-video w-full lg:col-span-5" />
        </div>
      </Container>
    </div>
  );
}

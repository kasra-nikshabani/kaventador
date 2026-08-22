import { CardGridSkeleton } from "@/components/shared";
import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <div className="border-border bg-surface border-b">
        <Container className="space-y-4 py-12 sm:py-16">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </Container>
      </div>

      <Container className="py-10">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-24" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-36" />
        </div>
        <div className="mt-8">
          <CardGridSkeleton count={6} />
        </div>
      </Container>
    </>
  );
}

import { CardGridSkeleton } from "@/components/shared";
import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <div className="border-border bg-surface border-b">
        <Container className="space-y-4 py-12 sm:py-16">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </Container>
      </div>
      <Container className="py-12">
        <CardGridSkeleton count={6} />
      </Container>
    </>
  );
}

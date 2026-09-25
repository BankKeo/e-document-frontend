import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <section className="max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">e-Document</h1>
        <p className="mt-2 text-muted-foreground">
          Production-ready Next.js foundation. See the example users feature to
          review the API, forms, and data-fetching architecture.
        </p>
      </section>
      <a href="/users" className={buttonVariants({ variant: "default" })}>
        View example: Users
      </a>
    </main>
  );
}

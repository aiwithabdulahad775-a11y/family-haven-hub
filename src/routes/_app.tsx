import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopAppBar } from "@/components/layout/TopAppBar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <TopAppBar />
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSavedItems, useToggleSave } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  itemId,
  kind,
  className,
}: {
  itemId: string;
  kind: "content" | "case_study";
  className?: string;
}) {
  const { user } = useAuth();
  const { data: saved } = useSavedItems(user?.id);
  const toggle = useToggleSave(user?.id);
  const isSaved = !!saved?.find((s) => s.item_kind === kind && s.item_id === itemId);

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={cn("h-8 w-8 rounded-full", className)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!user) {
          toast.error("Please sign in to save");
          return;
        }
        toggle.mutate(
          { kind, itemId, isSaved },
          {
            onSuccess: () => toast.success(isSaved ? "Removed" : "Saved"),
            onError: (err: Error) => toast.error(err.message),
          },
        );
      }}
      aria-label={isSaved ? "Remove bookmark" : "Save"}
    >
      {isSaved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  );
}

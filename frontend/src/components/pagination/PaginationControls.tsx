import { Button, ButtonGroup } from "@heroui/react";

type Props = {
  isPending: boolean;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
};

export function PaginationControls({
  isPending,
  canPreviousPage,
  canNextPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}: Props) {
  return (
    <ButtonGroup size="sm" variant="outline" className="sm:ml-auto">
      <Button
        onPress={onFirstPage}
        isDisabled={isPending || !canPreviousPage}
        aria-label="最初のページ"
      >
        &lt;&lt;
      </Button>
      <Button
        onPress={onPreviousPage}
        isDisabled={isPending || !canPreviousPage}
        aria-label="前のページ"
      >
        &lt;
      </Button>
      <Button
        onPress={onNextPage}
        isDisabled={isPending || !canNextPage}
        aria-label="次のページ"
      >
        &gt;
      </Button>
      <Button
        onPress={onLastPage}
        isDisabled={isPending || !canNextPage}
        aria-label="最後のページ"
      >
        &gt;&gt;
      </Button>
    </ButtonGroup>
  );
}

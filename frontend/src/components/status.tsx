import { Alert, Button, Spinner } from "@heroui/react";

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "読み込み中..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert status="danger" className="mx-auto max-w-lg text-left">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>エラーが発生しました</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-2" onPress={onRetry}>
            再試行
          </Button>
        )}
      </Alert.Content>
    </Alert>
  );
}

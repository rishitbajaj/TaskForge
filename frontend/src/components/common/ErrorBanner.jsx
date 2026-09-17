export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-lg border border-red-500 bg-red-950/40 px-4 py-3 text-sm text-red-200">
      <div className="flex items-start justify-between gap-3">
        <p>{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-red-300 hover:text-white"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

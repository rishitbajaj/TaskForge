export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-forge-bg text-forge-muted">
      <p className="text-sm font-semibold tracking-wide">{message}</p>
    </div>
  );
}

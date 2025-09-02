export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-gray-600 text-sm font-medium">Fetching weather...</p>
    </div>
  );
}

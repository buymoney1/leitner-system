// src/components/spinner.tsx
export default function Spinner() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-900">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }
// Fluent-style spinner (soft, glowing orange ring)
export const Spinner = () => (
  <div className="flex flex-col items-center justify-center space-y-3">
    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-gray-500">Loading...</p>
  </div>
)

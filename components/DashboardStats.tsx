// src/components/DashboardStats.tsx
interface DashboardStatsProps {
    totalCards: number;
    cardsDueToday: number;
  }
  
  export default function DashboardStats({ totalCards, cardsDueToday }: DashboardStatsProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">کل کارت‌ها</h3>
          <p className="text-3xl mt-1 font-bold text-blue-600">{totalCards}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">کارت‌های امروز</h3>
          <p className="text-3xl mt-1 font-bold text-green-600">{cardsDueToday}</p>
        </div>
      </div>
    );
  }
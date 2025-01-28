"use client";

export function RecentActivity() {
  const activities = [
    { id: 1, action: "Logged in", timestamp: "2023-10-15 14:30" },
    { id: 2, action: "Changed password", timestamp: "2023-10-14 10:15" },
    { id: 3, action: "Enabled 2FA", timestamp: "2023-10-13 09:00" },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg"
          >
            <p className="text-gray-300">{activity.action}</p>
            <p className="text-gray-400 text-sm">{activity.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

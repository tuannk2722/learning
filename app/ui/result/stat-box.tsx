export default function StatBox({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className={`${bg} p-6 rounded-3xl border border-black/5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
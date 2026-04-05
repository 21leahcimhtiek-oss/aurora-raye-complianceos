import Link from "next/link";

interface Props {
  id: string;
  name: string;
  version: string;
  controlCount: number;
  completionPct: number;
}

export function FrameworkCard({ id, name, version, controlCount, completionPct }: Props) {
  const barColor =
    completionPct >= 80 ? "bg-green-500" :
    completionPct >= 60 ? "bg-yellow-500" :
    completionPct >= 40 ? "bg-orange-500" :
                          "bg-red-500";

  return (
    <Link href={`/frameworks/${id}`} className="block group">
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">{name}</p>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">v{version}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className={`${barColor} h-1.5 rounded-full transition-all`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{completionPct}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{controlCount} controls</p>
        </div>
      </div>
    </Link>
  );
}
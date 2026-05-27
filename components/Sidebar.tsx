"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "Dashboard",    icon: "🏠" },
  { href: "/frameworks",  label: "Frameworks",   icon: "📋" },
  { href: "/controls",    label: "Controls",     icon: "✅" },
  { href: "/findings",    label: "Findings",     icon: "🔍" },
  { href: "/audits",      label: "Audits",       icon: "📅" },
  { href: "/reports",     label: "Reports",      icon: "📊" },
  { href: "/billing",     label: "Billing",      icon: "💳" },
  { href: "/settings",    label: "Settings",     icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">Aurora Rayes ComplianceOS</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">Aurora Rayes ComplianceOS v1.0.0</p>
      </div>
    </aside>
  );
}
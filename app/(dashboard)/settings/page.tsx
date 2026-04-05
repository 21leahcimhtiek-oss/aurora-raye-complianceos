"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Acme Corp");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage organisation settings and team members.</p>
      </div>

      {/* Org settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Organisation</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-1">
              Organisation name
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              readOnly
              value="acme-corp"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            {saved ? "Saved ✓" : "Save changes"}
          </button>
        </form>
      </div>

      {/* Team members */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Team Members</h2>
          <form action="/api/auth/invite" method="post">
            <button
              type="submit"
              className="bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700"
            >
              + Invite
            </button>
          </form>
        </div>
        <div className="space-y-3">
          {[
            { name: "Alice Johnson", email: "alice@acme.com", role: "Owner" },
            { name: "Bob Smith",     email: "bob@acme.com",   role: "Admin" },
            { name: "Carol White",   email: "carol@acme.com", role: "Member" },
          ].map((m) => (
            <div key={m.email} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-500">{m.email}</p>
              </div>
              <span className="text-xs text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">{m.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="text-base font-semibold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Permanently delete your organisation and all associated data. This cannot be undone.
        </p>
        <button className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700">
          Delete Organisation
        </button>
      </div>
    </div>
  );
}
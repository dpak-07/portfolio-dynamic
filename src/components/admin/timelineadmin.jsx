"use client";

import React, { useState } from "react";

export default function CertificationsAdmin() {
  const [certs, setCerts] = useState([
    { title: "Google Cloud Certified", issuer: "Google", year: "2024" },
  ]);
  const [newCert, setNewCert] = useState({ title: "", issuer: "", year: "" });

  const handleAdd = () => {
    if (!newCert.title || !newCert.issuer || !newCert.year) return;
    setCerts([...certs, newCert]);
    setNewCert({ title: "", issuer: "", year: "" });
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold mb-6 text-white">🏆 Manage Certifications</h2>

      <div className="flex flex-col gap-3 sm:flex-row mb-6">
        <input
          type="text"
          placeholder="Title"
          className="px-3 py-2 rounded bg-white/10 text-white outline-none"
          value={newCert.title}
          onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Issuer"
          className="px-3 py-2 rounded bg-white/10 text-white outline-none"
          value={newCert.issuer}
          onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
        />
        <input
          type="text"
          placeholder="Year"
          className="px-3 py-2 rounded bg-white/10 text-white outline-none"
          value={newCert.year}
          onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {certs.map((c, i) => (
          <li
            key={i}
            className="bg-white/5 border border-white/10 rounded p-3 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-400">{c.issuer} • {c.year}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

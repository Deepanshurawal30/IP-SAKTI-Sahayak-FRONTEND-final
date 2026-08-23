import React, { useEffect, useState } from 'react';

export default function SourcesView() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sources')
      .then(res => res.json())
      .then(data => {
        setSources(data.sources || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sources:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sources cited across Sahayak</h2>
        <p className="text-gray-600">Every important regulatory answer shows traceable, authoritative source citations. Click any source to open or download the exact document.</p>
      </div>

      {loading ? (
        <div className="text-gray-500 py-10">Loading authoritative documents from repository...</div>
      ) : sources.length === 0 ? (
        <div className="text-gray-500 py-10 bg-white border rounded-lg p-6 text-center">No PDF documents found in the backend documents directory.</div>
      ) : (
        <div className="space-y-4">
          {sources.map((src) => (
            <div key={src.id} className="border p-5 rounded-xl bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md">
              <div>
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">[{src.id}]</span>
                <h3 className="font-semibold text-lg text-gray-900 mt-2">{src.title}</h3>
                <p className="text-xs text-gray-500 mt-1">File: <span className="font-mono">{src.filename}</span> ({src.size_kb} KB) • Verified Local Repository Source</p>
              </div>
              <a 
                href={src.download_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800 transition flex items-center gap-2 whitespace-nowrap"
              >
                Read / Download ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
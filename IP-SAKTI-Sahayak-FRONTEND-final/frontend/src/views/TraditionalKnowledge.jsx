import React, { useState, useEffect } from 'react';

export default function TraditionalKnowledgeView() {
  const [tkData, setTkData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingInfo, setFetchingInfo] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/traditional-knowledge-info')
      .then(res => res.json())
      .then(data => {
        setTkData(data);
        setFetchingInfo(false);
      })
      .catch(err => {
        console.error("Error loading TK info:", err);
        setFetchingInfo(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/traditional-knowledge-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery })
    })
      .then(res => res.json())
      .then(data => {
        setSearchResult(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Search error:", err);
        setLoading(false);
      });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Introduction Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Traditional Knowledge & Prior Art Portal</h2>
        <div className="bg-amber-50/70 border border-amber-200 p-6 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-2">What is Traditional Knowledge (TK)?</h3>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            {fetchingInfo ? "Loading institutional overview..." : tkData?.introduction}
          </p>
        </div>
      </div>

      {/* Interactive Search Tool */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Check Your Innovation Against Recorded TK</h3>
        <p className="text-sm text-gray-500 mb-4">Type your proposed product, herb, or formulation below to verify if it conflicts with known public prior art.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., Turmeric skin cream, Ashwagandha stress capsule, Brahmi extract..." 
            className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
          <button 
            type="submit" 
            className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-emerald-800 transition whitespace-nowrap"
          >
            {loading ? 'Scanning Registry...' : 'Search TK Database'}
          </button>
        </form>

        {searchResult && (
          <div className="mt-5 p-5 rounded-xl bg-gray-50 border transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">Analysis Result</span>
              <h4 className="font-semibold text-sm text-gray-900">{searchResult.status}</h4>
            </div>
            {searchResult.matches && searchResult.matches.length > 0 ? (
              <div className="mt-3 space-y-2">
                {searchResult.matches.map((m, idx) => (
                  <div key={idx} className="text-sm bg-white p-3.5 rounded-lg border shadow-xs space-y-1">
                    <div className="font-bold text-emerald-900">{m.name}</div>
                    <p className="text-gray-600">{m.details}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 mt-1">No direct traditional knowledge conflict found in the baseline public registry subset. Ensure complete novelty documentation before filing.</p>
            )}
          </div>
        )}
      </div>

      {/* Official Government Enlisted Formulations Catalog */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">Official Government Enlisted Formulations (TKDL / Prior Art)</h3>
          <p className="text-sm text-gray-500">Representative catalog of traditional assets cataloged to prevent biopiracy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fetchingInfo ? (
            <p className="text-gray-500 py-4">Loading catalog entries...</p>
          ) : (
            tkData?.enlisted_formulations?.map((item) => (
              <div key={item.id} className="border rounded-xl p-5 bg-white shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{item.id}</span>
                    <span className="text-xs text-gray-500 font-medium">{item.category}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-base">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t text-xs font-mono text-gray-700 bg-gray-50 p-2.5 rounded-lg">
                  {item.statutory_status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
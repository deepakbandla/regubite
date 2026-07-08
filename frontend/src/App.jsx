import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Welcome to ReguBite. Ask me any food compliance or packaging questions based on the FSSAI documents.' }
  ]);
  const [activeCitations, setActiveCitations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setChatHistory((prev) => [...prev, { role: 'user', text: userMessage }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });
      const data = await response.json();

      setChatHistory((prev) => [...prev, { role: 'assistant', text: data.answer }]);
      if (data.sources && data.sources.length > 0) {
        setActiveCitations(data.sources);
      }
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: 'assistant', text: 'Failed to connect to the ReguBite backend engine.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Navbar Banner */}
      <header className="border-b border-slate-800 bg-slate-950 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400">ReguBite</h1>
          </div>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
            Gemini RAG Mode Active
          </span>
        </div>
      </header>

      {/* Main Grid Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Chat Window Container (Occupies 2 columns on big screens) */}
        <div className="lg:col-span-2 flex flex-col bg-slate-950 rounded-xl border border-slate-800 h-[calc(100vh-140px)]">
          
          {/* Conversational Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none' 
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none leading-relaxed'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse bg-emerald-500/5 border border-emerald-500/10 px-3 py-2 rounded-lg w-max">
                <span>🔍</span> Analyzing legal clauses and generating compliance match...
              </div>
            )}
          </div>

          {/* Form Entry Field */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-950 rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about packaging constraints, labeling, storage temps..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-md"
              >
                Verify
              </button>
            </div>
          </form>
        </div>

        {/* Verification & Legal Citation Panel (Occupies 1 column) */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 h-[calc(100vh-140px)] flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <span className="text-slate-400">📋</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Source Citations</h2>
          </div>
          
          {activeCitations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-4 border border-dashed border-slate-800 rounded-lg">
              <p className="text-sm font-medium">No citations mapped</p>
              <p className="text-xs mt-1 text-slate-600 max-w-[200px]">Submit a specific compliance query to verify matching public documents.</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {activeCitations.map((citation, index) => (
                <div key={index} className="p-3 bg-slate-900 border border-emerald-500/10 rounded-lg shadow-inner">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-1">
                    Verified Source Link:
                  </div>
                  <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-slate-800 break-all select-all">
                    📄 {citation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
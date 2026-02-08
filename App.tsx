
import React, { useState } from 'react';
import { PredictionForm } from './components/PredictionForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { StudentData, PredictionResult } from './types';
import { predictColleges } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (data: StudentData) => {
    setLoading(true);
    setError(null);
    try {
      const prediction = await predictColleges(data);
      setResults(prediction);
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-1 rounded-xl shadow-sm flex items-center justify-center">
               <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Student Silhouette */}
                  <path d="M50 50C57.732 50 64 43.732 64 36C64 28.268 57.732 22 50 22C42.268 22 36 28.268 36 36C36 43.732 42.268 50 50 50Z" fill="#1E293B"/>
                  <path d="M76 78C76 68.0589 64.3594 60 50 60C35.6406 60 24 68.0589 24 78V80H76V78Z" fill="#1E293B"/>
                  
                  {/* Graduation Cap */}
                  <path d="M50 14L22 26L50 38L78 26L50 14Z" fill="#1E293B"/>
                  <path d="M78 26V36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="78" cy="38" r="2" fill="#1E293B"/>
                  
                  {/* Verification Badge */}
                  <circle cx="74" cy="74" r="14" fill="#10B981"/>
                  <path d="M67 74L72 79L81 70" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Student's Choice</h1>
              <p className="text-indigo-200 text-sm">Empowering Your Future</p>
            </div>
          </div>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm font-medium">
              <li><a href="https://www.tneaonline.org/" target="_blank" rel="noreferrer" className="hover:text-indigo-200 transition">TNEA Info</a></li>
              <li><a href="https://dte.tn.gov.in/" target="_blank" rel="noreferrer" className="hover:text-indigo-200 transition">DTE Portal</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Section */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 sticky top-10">
              <h2 className="text-xl font-semibold mb-6 text-black flex items-center">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-md mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Admission Eligibility
              </h2>
              <PredictionForm onPredict={handlePredict} isLoading={loading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                  <strong>Analysis Error:</strong> {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {!results && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                  <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-black mb-2">Explore Your Future</h3>
                <p className="text-black opacity-70 max-w-sm">Enter your cutoff and category to discover verified college predictions based on historical trends.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-black font-medium animate-pulse">Analyzing TNEA Trends...</p>
                <div className="flex space-x-2">
                  <span className="text-xs text-black opacity-60">Querying Official Data</span>
                  <span className="text-xs text-black opacity-60">•</span>
                  <span className="text-xs text-black opacity-60">Applying Quota Logic</span>
                </div>
              </div>
            )}

            {results && !loading && <ResultsDisplay result={results} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm mb-4">© {new Date().getFullYear()} Student's Choice. Data-driven counseling for Tamil Nadu engineering admissions.</p>
          <div className="flex justify-center space-x-6 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

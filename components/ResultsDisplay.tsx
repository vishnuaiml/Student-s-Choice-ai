
import React from 'react';
import { PredictionResult, CollegePrediction } from '../types';

interface Props {
  result: PredictionResult;
}

const TierBadge: React.FC<{ tier: CollegePrediction['tier'] }> = ({ tier }) => {
  const styles = {
    Safe: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Moderate: 'bg-blue-100 text-blue-700 border-blue-200',
    Reach: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[tier]}`}>
      {tier}
    </span>
  );
};

export const ResultsDisplay: React.FC<Props> = ({ result }) => {
  return (
    <div className="space-y-8 animate-fadeIn text-black">
      {/* AI Insights Header */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
             <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
             Admission Insights
          </h2>
          <div className="bg-indigo-500/30 backdrop-blur-sm rounded-xl p-5 border border-indigo-400/30">
            <p className="text-white leading-relaxed text-sm">
              {result.insights}
            </p>
          </div>
        </div>
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
      </div>

      {/* College List */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 flex items-center">
          Eligible Colleges ({result.predictions.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.predictions.map((college, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition group flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold text-black opacity-40 uppercase tracking-wider">
                  Code: {college.collegeCode}
                </div>
                <TierBadge tier={college.tier} />
              </div>
              
              <h4 className="font-bold text-black mb-1 leading-tight group-hover:text-indigo-600 transition">
                {college.collegeName}
              </h4>
              <p className="text-xs text-black opacity-60 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {college.location}
              </p>

              <div className="space-y-2 mb-4 flex-grow">
                <div className="flex justify-between text-xs">
                  <span className="text-black opacity-50">Course</span>
                  <span className="text-black font-medium">{college.course}</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-black opacity-50">Prev Year Cutoff</span>
                  <span className="text-black font-medium">{college.lastYearCutoff.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs items-center bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
                  <span className="text-indigo-700 font-semibold">Target Year Expected</span>
                  <span className="text-indigo-900 font-bold">{college.expectedCutoff.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-black opacity-50">Admission Chance</span>
                    <span className={`text-xs font-bold ${college.probability > 75 ? 'text-emerald-600' : college.probability > 40 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {college.probability}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        college.tier === 'Safe' ? 'bg-emerald-500' : college.tier === 'Moderate' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${college.probability}%` }}
                    ></div>
                  </div>
                </div>

                {college.officialLink && (
                  <a 
                    href={college.officialLink.startsWith('http') ? college.officialLink : `https://${college.officialLink}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-2 w-full text-xs font-bold text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Visit College Website</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources / Grounding */}
      {result.sources.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="text-sm font-bold text-black mb-4 flex items-center uppercase tracking-wider">
            Verified Official Sources
          </h3>
          <ul className="space-y-3">
            {result.sources.map((source, idx) => (
              <li key={idx} className="flex items-center text-xs">
                <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-black hover:text-indigo-600 hover:underline transition truncate"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

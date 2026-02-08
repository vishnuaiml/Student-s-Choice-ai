
import React, { useState } from 'react';
import { StudentData, Category, Quota } from '../types';
import { DISTRICTS, COURSES, CATEGORIES, QUOTAS } from '../constants';

interface Props {
  onPredict: (data: StudentData) => void;
  isLoading: boolean;
}

export const PredictionForm: React.FC<Props> = ({ onPredict, isLoading }) => {
  const [formData, setFormData] = useState<StudentData>({
    cutoff: 180,
    category: Category.OC,
    quota: Quota.GENERAL,
    preferredCourse: COURSES[0],
    district: DISTRICTS[0],
    targetYear: 2026
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cutoff Mark */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Cutoff Mark (0-200)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="200"
              required
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-black"
              value={formData.cutoff}
              onChange={(e) => setFormData({ ...formData, cutoff: parseFloat(e.target.value) })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black opacity-40 font-medium">/ 200</span>
          </div>
        </div>

        {/* Present/Target Year */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Target Admission Year
          </label>
          <input
            type="number"
            min="2024"
            max="2030"
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-black font-semibold"
            value={formData.targetYear}
            onChange={(e) => setFormData({ ...formData, targetYear: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Caste Category</label>
          <select
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none text-black"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Quota */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Special Quota</label>
          <select
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none text-black"
            value={formData.quota}
            onChange={(e) => setFormData({ ...formData, quota: e.target.value as Quota })}
          >
            {QUOTAS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
      </div>

      {/* Preferred Course */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">Preferred Engineering Course</label>
        <select
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none text-black"
          value={formData.preferredCourse}
          onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
        >
          {COURSES.map(course => <option key={course} value={course}>{course}</option>)}
        </select>
      </div>

      {/* District Preference */}
      <div>
        <label className="block text-sm font-medium text-black mb-1">Preferred District</label>
        <select
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none text-black"
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
        >
          {DISTRICTS.map(district => <option key={district} value={district}>{district}</option>)}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-2 ${
          isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Analyze</span>
          </>
        )}
      </button>

      <div className="bg-amber-50 p-4 rounded-xl flex items-start space-x-3 border border-amber-100">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-black leading-relaxed">
          AI prediction is based on trends from the years immediately preceding {formData.targetYear}. Final results depend on current year applicant volume.
        </p>
      </div>
    </form>
  );
};

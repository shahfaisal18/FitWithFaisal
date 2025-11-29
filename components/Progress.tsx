import React from 'react';
import { Workout } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ProgressProps {
  workouts: Workout[];
}

const Progress: React.FC<ProgressProps> = ({ workouts }) => {
  // Prepare data for Volume Chart
  const volumeData = [...workouts]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(w => {
      const totalVolume = w.exercises.reduce((acc, ex) => {
        return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
      }, 0);
      return {
        date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        volume: totalVolume,
        name: w.name
      };
    });

  // Prepare data for Workout Frequency (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const frequencyData = last7Days.map(dateStr => {
    const count = workouts.filter(w => w.date.startsWith(dateStr)).length;
    const dayName = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short' });
    return { day: dayName, count };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>

      <div className="bg-brand-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-brand-neon rounded-full"></span>
            Volume Over Time (lbs)
        </h3>
        <div className="h-64 w-full">
            {volumeData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={volumeData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                   <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                   <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#84cc16' }}
                   />
                   <Line type="monotone" dataKey="volume" stroke="#84cc16" strokeWidth={3} dot={{ fill: '#1e293b', stroke: '#84cc16', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#84cc16' }} />
                 </LineChart>
               </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                    Not enough data yet.
                </div>
            )}
         
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                Weekly Consistency
            </h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        cursor={{fill: '#334155', opacity: 0.2}}
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-brand-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-center">
             <h3 className="text-lg font-semibold text-white mb-2">Total Lifted</h3>
             <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-brand-accent">
                {(volumeData.reduce((acc, curr) => acc + curr.volume, 0) / 2000).toFixed(1)} Tons
             </div>
             <p className="text-slate-400 text-sm mt-2">That's roughly equal to {Math.floor(volumeData.reduce((acc, curr) => acc + curr.volume, 0) / 3000)} small cars!</p>
        </div>
      </div>
    </div>
  );
};

export default Progress;
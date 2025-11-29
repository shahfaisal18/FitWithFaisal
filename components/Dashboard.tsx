import React from 'react';
import { Workout } from '../types';
import { Activity, Calendar, Trophy, Zap } from 'lucide-react';

interface DashboardProps {
  workouts: Workout[];
  onChangeView: (view: 'log') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, onChangeView }) => {
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((acc, w) => acc + w.durationMinutes, 0);
  
  // Calculate Streak (Simplified: check if last workout was within 3 days)
  const lastWorkoutDate = workouts.length > 0 ? new Date(workouts[0].date) : null;
  const now = new Date();
  const diffTime = lastWorkoutDate ? Math.abs(now.getTime() - lastWorkoutDate.getTime()) : Infinity;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const isStreakActive = diffDays <= 3;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Stronger Every Day.</h1>
        <p className="text-brand-neon font-medium text-lg">Train. Transform. Thrive.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-card p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-brand-neon/20 flex items-center justify-center text-brand-neon mb-2">
            <Activity size={20} />
          </div>
          <span className="text-2xl font-bold text-white">{totalWorkouts}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider">Workouts</span>
        </div>
        
        <div className="bg-brand-card p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
            <Zap size={20} />
          </div>
          <span className="text-2xl font-bold text-white">{totalMinutes}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider">Minutes</span>
        </div>

        <div className="bg-brand-card p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
            <Trophy size={20} />
          </div>
          <span className="text-2xl font-bold text-white">Pro</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider">Level</span>
        </div>

        <div className="bg-brand-card p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isStreakActive ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700/20 text-slate-500'}`}>
            <Calendar size={20} />
          </div>
          <span className="text-2xl font-bold text-white">{isStreakActive ? 'Active' : 'Inactive'}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider">Streak</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-brand-card rounded-2xl border border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <button onClick={() => onChangeView('log')} className="text-xs font-semibold text-brand-neon hover:text-brand-neonHover transition-colors">
            + LOG NEW
          </button>
        </div>

        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No workouts logged yet. Start today!
            </div>
          ) : (
            workouts.slice(0, 3).map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-brand-neon/30 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-lg">
                    {new Date(workout.date).getDate()}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{workout.name}</h3>
                    <p className="text-sm text-slate-500">
                      {workout.exercises.length} Exercises • {workout.durationMinutes} Min
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-500 block">Total Volume</span>
                  <span className="text-sm font-semibold text-brand-neon">
                    {workout.exercises.reduce((total, ex) => total + ex.sets.reduce((sTotal, s) => sTotal + (s.weight * s.reps), 0), 0).toLocaleString()} lbs
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
        <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Coach's Tip</h3>
            <p className="text-slate-300 italic">"Fit Mind. Fit Body. Consistency is the key to your transformation."</p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-brand-neon/10 blur-3xl rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Dashboard;
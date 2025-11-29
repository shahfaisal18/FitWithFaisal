import React, { useState, useEffect } from 'react';
import { ViewState, Workout, MOCK_WORKOUTS } from './types';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import AICoach from './components/AICoach';
import Progress from './components/Progress';
import { LayoutDashboard, PlusCircle, LineChart, MessageSquareMore, Menu, X, Dumbbell } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize with mock data for demonstration
  useEffect(() => {
    // In a real app, load from localStorage or API
    setWorkouts(MOCK_WORKOUTS);
  }, []);

  const handleSaveWorkout = (newWorkout: Workout) => {
    setWorkouts([newWorkout, ...workouts]);
    setView('dashboard');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Log Workout', icon: PlusCircle },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'coach', label: 'AI Coach', icon: MessageSquareMore },
  ];

  return (
    <div className="min-h-screen bg-brand-dark font-sans text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-brand-card border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="bg-brand-neon p-1 rounded">
                <Dumbbell className="text-brand-dark" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">FitWithFaisal</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-card border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
          <div className="bg-brand-neon p-2 rounded-lg shadow-lg shadow-brand-neon/20">
             <Dumbbell className="text-brand-dark" size={24} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">FitWithFaisal</span>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewState);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-neon text-slate-900 font-bold shadow-lg shadow-brand-neon/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
            <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 border border-slate-700">
                <img src="https://picsum.photos/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-brand-neon" />
                <div>
                    <div className="text-sm font-bold text-white">Guest User</div>
                    <div className="text-xs text-slate-400">Pro Member</div>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen scroll-smooth">
        <div className="max-w-5xl mx-auto">
            {view === 'dashboard' && <Dashboard workouts={workouts} onChangeView={setView} />}
            {view === 'log' && <WorkoutLogger onSave={handleSaveWorkout} onCancel={() => setView('dashboard')} />}
            {view === 'progress' && <Progress workouts={workouts} />}
            {view === 'coach' && <AICoach />}
        </div>
      </main>

      {/* Mobile Bottom Nav Overlay (Optional, but using Sidebar menu for consistency mostly. If needed, can be added here) */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default App;
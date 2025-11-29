import React, { useState } from 'react';
import { Exercise, Set, Workout } from '../types';
import { Plus, Trash2, Save, Dumbbell, Clock } from 'lucide-react';

interface WorkoutLoggerProps {
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(45);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: generateId(),
        name: '',
        sets: [
          { id: generateId(), reps: 10, weight: 0, completed: true }
        ]
      }
    ]);
  };

  const updateExerciseName = (id: string, newName: string) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, name: newName } : e));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(e => {
      if (e.id === exerciseId) {
        // Clone last set if exists for convenience
        const lastSet = e.sets[e.sets.length - 1];
        const newSet: Set = lastSet 
          ? { ...lastSet, id: generateId() } 
          : { id: generateId(), reps: 10, weight: 0, completed: true };
        return { ...e, sets: [...e.sets, newSet] };
      }
      return e;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: number | boolean) => {
    setExercises(exercises.map(e => {
      if (e.id === exerciseId) {
        return {
          ...e,
          sets: e.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return e;
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(e => {
      if (e.id === exerciseId) {
        return { ...e, sets: e.sets.filter(s => s.id !== setId) };
      }
      return e;
    }));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please give your workout a name!");
      return;
    }
    if (exercises.length === 0) {
      alert("Please add at least one exercise.");
      return;
    }

    const newWorkout: Workout = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      durationMinutes: duration,
      exercises
    };

    onSave(newWorkout);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Dumbbell className="text-brand-neon" /> Log Workout
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">Cancel</button>
      </div>

      <div className="bg-brand-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Workout Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Cardio, Leg Destroyer"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-neon outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Duration (Minutes)</label>
          <div className="flex items-center gap-2">
             <Clock size={18} className="text-slate-500"/>
             <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="w-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-neon outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={exercise.id} className="bg-brand-card p-4 rounded-xl border border-slate-800 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-4">
                <label className="text-xs text-brand-neon uppercase font-bold mb-1 block">Exercise {index + 1}</label>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                  placeholder="Exercise Name (e.g. Bench Press)"
                  className="w-full bg-transparent text-xl font-bold text-white placeholder-slate-600 outline-none border-b border-transparent focus:border-slate-700"
                />
              </div>
              <button 
                onClick={() => removeExercise(exercise.id)}
                className="text-slate-500 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-10 gap-2 text-xs text-slate-500 uppercase font-semibold text-center mb-2">
                <div className="col-span-2">Set</div>
                <div className="col-span-3">Lbs</div>
                <div className="col-span-3">Reps</div>
                <div className="col-span-2"></div>
              </div>
              
              {exercise.sets.map((set, setIndex) => (
                <div key={set.id} className="grid grid-cols-10 gap-2 items-center">
                  <div className="col-span-2 flex justify-center">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                      {setIndex + 1}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-center text-white focus:border-brand-neon outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseFloat(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-center text-white focus:border-brand-neon outline-none"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button 
                        onClick={() => removeSet(exercise.id, set.id)}
                        className="text-slate-600 hover:text-red-400"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => addSet(exercise.id)}
              className="mt-4 w-full py-2 bg-slate-800/50 hover:bg-slate-800 text-brand-neon text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors border border-dashed border-slate-700"
            >
              <Plus size={16} /> Add Set
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addExercise}
        className="w-full py-4 bg-slate-900 border border-slate-700 hover:border-brand-neon text-white rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={20} /> Add Exercise
      </button>

      <div className="sticky bottom-4">
        <button
          onClick={handleSave}
          className="w-full py-4 bg-brand-neon hover:bg-brand-neonHover text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-brand-neon/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <Save size={24} /> Finish Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutLogger;
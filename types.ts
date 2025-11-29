export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO String
  durationMinutes: number;
  exercises: Exercise[];
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'dashboard' | 'log' | 'progress' | 'coach';

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: 'w-1',
    name: 'Upper Body Power',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    durationMinutes: 45,
    exercises: [
      {
        id: 'e-1',
        name: 'Bench Press',
        sets: [
          { id: 's-1', reps: 10, weight: 135, completed: true },
          { id: 's-2', reps: 8, weight: 155, completed: true },
          { id: 's-3', reps: 5, weight: 175, completed: true }
        ]
      },
      {
        id: 'e-2',
        name: 'Pull Ups',
        sets: [
          { id: 's-4', reps: 12, weight: 0, completed: true },
          { id: 's-5', reps: 10, weight: 0, completed: true }
        ]
      }
    ]
  },
  {
    id: 'w-2',
    name: 'Leg Day',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    durationMinutes: 60,
    exercises: [
      {
        id: 'e-3',
        name: 'Squat',
        sets: [
          { id: 's-6', reps: 10, weight: 185, completed: true },
          { id: 's-7', reps: 10, weight: 185, completed: true },
          { id: 's-8', reps: 10, weight: 185, completed: true }
        ]
      }
    ]
  }
];
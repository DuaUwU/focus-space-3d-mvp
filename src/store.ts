import { create } from 'zustand'

export type Panel = 'timer' | 'music' | 'weather' | 'tasks' | 'journal' | 'settings' | null
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'night'
export type Task = { id: string; title: string; done: boolean }

type State = {
  panel: Panel
  setPanel: (panel: Panel) => void
  weather: Weather
  setWeather: (weather: Weather) => void
  tasks: Task[]
  addTask: (title: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  journal: string
  setJournal: (value: string) => void
  quality: 'low' | 'medium' | 'high'
  setQuality: (quality: 'low' | 'medium' | 'high') => void
}

const defaultTasks: Task[] = [
  { id: '1', title: 'Review lecture notes', done: false },
  { id: '2', title: 'Read 10 pages', done: true }
]

const isTaskList = (value: unknown): value is Task[] =>
  Array.isArray(value) && value.every((task: unknown) =>
    task !== null && typeof task === 'object' &&
    typeof (task as Task).id === 'string' &&
    typeof (task as Task).title === 'string' &&
    typeof (task as Task).done === 'boolean'
  )

const read = <T,>(key: string, fallback: T, isValid: (value: unknown) => value is T): T => {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return fallback
    const value: unknown = JSON.parse(stored)
    return isValid(value) ? value : fallback
  }
  catch { return fallback }
}
const persist = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)) }
  catch { /* Keep the current session usable when browser storage is unavailable. */ }
}

export const useStore = create<State>((set, get) => ({
  panel: null,
  setPanel: (panel) => set({ panel }),
  weather: read<Weather>('fs-weather', 'rainy', (value): value is Weather =>
    value === 'sunny' || value === 'rainy' || value === 'cloudy' || value === 'night'
  ),
  setWeather: (weather) => { persist('fs-weather', weather); set({ weather }) },
  tasks: read<Task[]>('fs-tasks', defaultTasks, isTaskList),
  addTask: (title) => {
    const tasks = [...get().tasks, { id: crypto.randomUUID(), title, done: false }]
    persist('fs-tasks', tasks); set({ tasks })
  },
  toggleTask: (id) => {
    const tasks = get().tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    persist('fs-tasks', tasks); set({ tasks })
  },
  deleteTask: (id) => {
    const tasks = get().tasks.filter(t => t.id !== id)
    persist('fs-tasks', tasks); set({ tasks })
  },
  journal: read<string>('fs-journal', '', (value): value is string => typeof value === 'string'),
  setJournal: (journal) => { persist('fs-journal', journal); set({ journal }) },
  quality: read<State['quality']>('fs-quality', 'medium', (value): value is State['quality'] =>
    value === 'low' || value === 'medium' || value === 'high'
  ),
  setQuality: (quality) => { persist('fs-quality', quality); set({ quality }) }
}))

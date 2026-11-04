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

const read = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback }
  catch { return fallback }
}
const persist = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value))

export const useStore = create<State>((set, get) => ({
  panel: null,
  setPanel: (panel) => set({ panel }),
  weather: read<Weather>('fs-weather', 'rainy'),
  setWeather: (weather) => { persist('fs-weather', weather); set({ weather }) },
  tasks: read<Task[]>('fs-tasks', [
    { id: '1', title: 'Review lecture notes', done: false },
    { id: '2', title: 'Read 10 pages', done: true }
  ]),
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
  journal: read('fs-journal', ''),
  setJournal: (journal) => { persist('fs-journal', journal); set({ journal }) },
  quality: read('fs-quality', 'medium'),
  setQuality: (quality) => { persist('fs-quality', quality); set({ quality }) }
}))

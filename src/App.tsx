import { useEffect, useRef, useState } from 'react'
import { Headphones, CloudRain, Sun, Moon, Cloud, BookOpen, Monitor, Check, Plus, Trash2, X, Play, Pause, RotateCcw, Maximize, Settings, Leaf, Volume2 } from 'lucide-react'
import World from './World'
import { useStore, type Panel, type Weather } from './store'

function TimerPanel() {
  const [duration, setDuration] = useState(25)
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const endAt = useRef<number | null>(null)
  useEffect(() => {
    if (!running) return
    endAt.current = Date.now() + remaining * 1000
    const id = window.setInterval(() => {
      const next = Math.max(0, Math.ceil(((endAt.current ?? Date.now()) - Date.now()) / 1000))
      setRemaining(next)
      if (next === 0) { setRunning(false); endAt.current = null; try { new AudioContext().resume() } catch {} }
    }, 250)
    return () => window.clearInterval(id)
  }, [running])
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const choose = (m: number) => { setDuration(m); setRemaining(m * 60); setRunning(false) }
  return <div className="panel-content">
    <div className="eyebrow">FOCUS SESSION</div>
    <div className="timer">{fmt(remaining)}</div>
    <div className="muted">A little progress is still progress.</div>
    <div className="preset-row">{[25, 50, 90].map(m => <button className={duration === m ? 'chip active' : 'chip'} key={m} onClick={() => choose(m)}>{m} min</button>)}</div>
    <div className="button-row">
      <button className="primary" onClick={() => setRunning(!running)}>{running ? <Pause size={16}/> : <Play size={16}/>} {running ? 'Pause' : 'Start'}</button>
      <button className="icon-button" onClick={() => { setRunning(false); setRemaining(duration * 60) }} aria-label="Reset"><RotateCcw size={17}/></button>
    </div>
  </div>
}
function MusicPanel() {
  const [volume, setVolume] = useState(35)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<AudioContext | null>(null)
  const start = async () => {
    try {
      if (!audioRef.current) audioRef.current = new AudioContext()
      await audioRef.current.resume()
      setPlaying(!playing)
    } catch { setPlaying(false) }
  }
  return <div className="panel-content">
    <div className="eyebrow">AMBIENT SOUND</div>
    <h2>Find your atmosphere.</h2>
    <div className="sound-card"><CloudRain/><div><b>Soft Rain</b><small>Gentle rain ambience</small></div><button className="icon-button" onClick={start}>{playing ? <Pause/> : <Play/>}</button></div>
    <label className="field-label">Volume · {volume}%</label>
    <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))}/>
    <p className="muted small">MVP note: sound controls are a UI placeholder. Connect a licensed or user-provided audio file to enable actual playback.</p>
  </div>
}
function TasksPanel() {
  const tasks = useStore(s => s.tasks), addTask = useStore(s => s.addTask), toggle = useStore(s => s.toggleTask), remove = useStore(s => s.deleteTask)
  const [value, setValue] = useState('')
  return <div className="panel-content">
    <div className="eyebrow">YOUR LITTLE PLAN</div><h2>Today's tasks</h2>
    <form className="add-row" onSubmit={e => { e.preventDefault(); if (value.trim()) { addTask(value.trim()); setValue('') } }}>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="What would you like to do?" />
      <button className="primary compact" aria-label="Add task"><Plus size={17}/></button>
    </form>
    <div className="task-list">{tasks.map(t => <div className="task" key={t.id}>
      <button className={t.done ? 'check checked' : 'check'} onClick={() => toggle(t.id)}>{t.done && <Check size={13}/>}</button>
      <span className={t.done ? 'done' : ''}>{t.title}</span>
      <button className="delete" onClick={() => remove(t.id)} aria-label="Delete task"><Trash2 size={14}/></button>
    </div>)}</div>
    <div className="muted small">{tasks.filter(t => t.done).length} of {tasks.length} completed</div>
  </div>
}
function JournalPanel() {
  const journal = useStore(s => s.journal), setJournal = useStore(s => s.setJournal)
  return <div className="panel-content"><div className="eyebrow">A QUIET CORNER</div><h2>Little journal</h2>
    <textarea className="journal" value={journal} onChange={e => setJournal(e.target.value)} placeholder="Write down what's on your mind..."/>
    <div className="muted small">Saved automatically on this device.</div>
  </div>
}
function WeatherPanel() {
  const weather = useStore(s => s.weather), setWeather = useStore(s => s.setWeather)
  const options: {id: Weather, label: string, icon: typeof Sun}[] = [
    {id:'sunny',label:'Sunny',icon:Sun},{id:'rainy',label:'Rainy',icon:CloudRain},{id:'cloudy',label:'Cloudy',icon:Cloud},{id:'night',label:'Night',icon:Moon}
  ]
  return <div className="panel-content"><div className="eyebrow">CHANGE THE MOOD</div><h2>Outside your window</h2>
    <div className="weather-grid">{options.map(o => <button key={o.id} className={weather === o.id ? 'weather-option selected' : 'weather-option'} onClick={() => setWeather(o.id)}><o.icon/><span>{o.label}</span></button>)}</div>
    <p className="muted small">Atmosphere is simulated locally; no weather API required.</p>
  </div>
}
function SettingsPanel() {
  const quality = useStore(s => s.quality), setQuality = useStore(s => s.setQuality)
  return <div className="panel-content"><div className="eyebrow">PREFERENCES</div><h2>Graphics quality</h2>
    {(['low','medium','high'] as const).map(q => <button key={q} className={quality === q ? 'setting-row selected' : 'setting-row'} onClick={() => setQuality(q)}>{q[0].toUpperCase()+q.slice(1)} {quality === q && <Check size={16}/>}</button>)}
    <p className="muted small">Choose Low on integrated graphics or when you want to save battery.</p>
  </div>
}
const panelTitles: Record<Exclude<Panel, null>, string> = {timer:'Focus timer',music:'Sound room',weather:'Atmosphere',tasks:'Tasks',journal:'Journal',settings:'Settings'}
function PanelView({panel}: {panel: Exclude<Panel, null>}) {
  return <aside className="panel">
    <div className="panel-header"><b>{panelTitles[panel]}</b><button className="icon-button" onClick={() => useStore.getState().setPanel(null)}><X size={17}/></button></div>
    {panel === 'timer' && <TimerPanel/>}
    {panel === 'music' && <MusicPanel/>}
    {panel === 'weather' && <WeatherPanel/>}
    {panel === 'tasks' && <TasksPanel/>}
    {panel === 'journal' && <JournalPanel/>}
    {panel === 'settings' && <SettingsPanel/>}
  </aside>
}

export default function App() {
  const panel = useStore(s => s.panel), setPanel = useStore(s => s.setPanel)
  const [fullscreen, setFullscreen] = useState(false)
  const openFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
    setFullscreen(!fullscreen)
  }
  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Leaf size={18}/></span><span>focus<span className="brand-light">space</span></span></div>
      <div className="top-actions">
        <span className="status"><span className="status-dot"/> Your quiet place</span>
        <button className="icon-button" onClick={() => setPanel('music')} aria-label="Sound"><Volume2 size={18}/></button>
        <button className="icon-button" onClick={() => setPanel('settings')} aria-label="Settings"><Settings size={18}/></button>
        <button className="icon-button" onClick={openFullscreen} aria-label="Fullscreen"><Maximize size={17}/></button>
      </div>
    </header>
    <section className="intro"><div><div className="eyebrow">A LITTLE SPACE FOR YOURSELF</div><h1>Slow down. <em>Focus in.</em></h1><p>Take a breath. Make room for what matters.</p></div><div className="date-note">YOUR COZY ROOM <span>✦</span></div></section>
    <section className="world-wrap">
      <div className="world-hint"><span className="hint-dot"/> Drag to explore · Click an object</div>
      <World/>
      {panel && <PanelView panel={panel}/>}
      <div className="world-label">ROOM 01 <span>·</span> RAINY AFTERNOON</div>
    </section>
    <nav className="quick-nav">
      <button onClick={() => setPanel('timer')}><Monitor/><span>Focus</span></button>
      <button onClick={() => setPanel('music')}><Headphones/><span>Sounds</span></button>
      <button onClick={() => setPanel('weather')}><CloudRain/><span>Weather</span></button>
      <button onClick={() => setPanel('tasks')}><Check/><span>Tasks</span></button>
      <button onClick={() => setPanel('journal')}><BookOpen/><span>Journal</span></button>
    </nav>
    <footer>LESS NOISE, MORE PRESENCE <span>✦</span> MADE FOR SLOWER DAYS</footer>
  </main>
}

import type { FormEvent } from "react"
import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type UserCreds = { username: string; password: string }

type Outlet = { id: number; name: string }
type Period = { id: number; month: number; year: number }
type KPI = { id: number; name: string }
type Update = { id: number; outlet_id: number; period_id: number; kpi_id: number; value: number; note?: string }
type Feedback = { id: number; outlet_id: number; period_id: number; text: string }
type FileRec = { id: number; outlet_id: number; period_id: number; path: string }
type Metric = { period: string; value: number; note?: string }

function App() {
  const [creds, setCreds] = useState<UserCreds | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [newOutlet, setNewOutlet] = useState('')
  const [periods, setPeriods] = useState<Period[]>([])
  const [newPeriodMonth, setNewPeriodMonth] = useState('')
  const [newPeriodYear, setNewPeriodYear] = useState('')
  const [kpis, setKpis] = useState<KPI[]>([])
  const [newKpi, setNewKpi] = useState('')
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null)
  const [selectedKpi, setSelectedKpi] = useState<number | null>(null)
  const [updates, setUpdates] = useState<Update[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [updateValue, setUpdateValue] = useState('')
  const [updateNote, setUpdateNote] = useState('')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [feedbackOutlet, setFeedbackOutlet] = useState<number | null>(null)
  const [feedbackPeriod, setFeedbackPeriod] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [files, setFiles] = useState<FileRec[]>([])
  const [fileOutlet, setFileOutlet] = useState<number | null>(null)
  const [filePeriod, setFilePeriod] = useState<number | null>(null)
  const [filePath, setFilePath] = useState('')
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const [u, p] = atob(stored).split(':')
      setCreds({ username: u, password: p })
    }
  }, [])

  useEffect(() => {
    if (creds) {
      localStorage.setItem('auth', btoa(`${creds.username}:${creds.password}`))
      const headers = {
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      }
      fetch(`${API_URL}/outlets/`, { headers })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setOutlets(data))
        .catch(() => setOutlets([]))
      fetch(`${API_URL}/periods/`, { headers })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setPeriods(data))
        .catch(() => setPeriods([]))
      fetch(`${API_URL}/kpis/`, { headers })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setKpis(data))
        .catch(() => setKpis([]))
    }
  }, [creds])

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    setCreds({ username, password })
  }

  const handleCreateOutlet = () => {
    if (!creds || !newOutlet) return
    fetch(`${API_URL}/outlets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      },
      body: JSON.stringify({ name: newOutlet }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((o) => setOutlets((prev) => [...prev, o]))
      .then(() => setNewOutlet(''))
      .catch(() => alert('Failed to create outlet'))
  }

  const handleCreatePeriod = () => {
    if (!creds || !newPeriodMonth || !newPeriodYear) return
    fetch(`${API_URL}/periods/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      },
      body: JSON.stringify({ month: Number(newPeriodMonth), year: Number(newPeriodYear) }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p) => setPeriods((prev) => [...prev, p]))
      .then(() => { setNewPeriodMonth(''); setNewPeriodYear('') })
      .catch(() => alert('Failed to create period'))
  }

  const handleCreateKpi = () => {
    if (!creds || !newKpi) return
    fetch(`${API_URL}/kpis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      },
      body: JSON.stringify({ name: newKpi }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((k) => setKpis((prev) => [...prev, k]))
      .then(() => setNewKpi(''))
      .catch(() => alert('Failed to create KPI'))
  }

  const loadUpdates = () => {
    if (!creds || !selectedOutlet || !selectedKpi) return
    fetch(`${API_URL}/updates/${selectedOutlet}/${selectedKpi}`, {
      headers: {
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUpdates(data))
      .catch(() => setUpdates([]))
  }

  const handleCreateUpdate = () => {
    if (!creds || !selectedOutlet || !selectedKpi || !selectedPeriod || !updateValue) return
    fetch(`${API_URL}/updates/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      },
      body: JSON.stringify({
        outlet_id: selectedOutlet,
        period_id: selectedPeriod,
        kpi_id: selectedKpi,
        value: Number(updateValue),
        note: updateNote || null,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => { setUpdateValue(''); setUpdateNote(''); loadUpdates() })
      .catch(() => alert('Failed to create update'))
  }

  const loadFeedback = () => {
    if (!creds || !feedbackOutlet) return
    fetch(`${API_URL}/feedback/${feedbackOutlet}`, {
      headers: { Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setFeedbacks(data))
      .catch(() => setFeedbacks([]))
  }

  const handleCreateFeedback = () => {
    if (!creds || !feedbackOutlet || !feedbackPeriod || !feedbackText) return
    fetch(`${API_URL}/feedback/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      },
      body: JSON.stringify({
        outlet_id: feedbackOutlet,
        period_id: feedbackPeriod,
        text: feedbackText,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => { setFeedbackText(''); loadFeedback() })
      .catch(() => alert('Failed to create feedback'))
  }

  const loadFiles = () => {
    if (!creds || !fileOutlet || !filePeriod) return
    fetch(`${API_URL}/files/${fileOutlet}/${filePeriod}`, {
      headers: { Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setFiles(data))
      .catch(() => setFiles([]))
  }

  const handleCreateFile = () => {
    if (!creds || !fileOutlet || !filePeriod || !filePath) return
    fetch(`${API_URL}/files/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}`,
      },
      body: JSON.stringify({
        outlet_id: fileOutlet,
        period_id: filePeriod,
        path: filePath,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => { setFilePath(''); loadFiles() })
      .catch(() => alert('Failed to create file entry'))
  }

  const loadMetrics = () => {
    if (!creds || !selectedOutlet || !selectedKpi) return
    fetch(`${API_URL}/metrics/${selectedOutlet}/${selectedKpi}`, {
      headers: { Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setMetrics(data))
      .catch(() => setMetrics([]))
  }

  if (!creds) {
    return (
      <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: '2rem auto' }}>
        <h2>Login</h2>
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <section>
        <h2>Outlets</h2>
        <ul>
          {outlets.map((o) => (
            <li key={o.id}>{o.name}</li>
          ))}
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <input
            placeholder="New outlet"
            value={newOutlet}
            onChange={(e) => setNewOutlet(e.target.value)}
          />
          <button onClick={handleCreateOutlet}>Create</button>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Periods</h2>
        <ul>
          {periods.map((p) => (
            <li key={p.id}>{p.year}-{String(p.month).padStart(2, '0')}</li>
          ))}
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <input
            type="number"
            placeholder="Month"
            value={newPeriodMonth}
            onChange={(e) => setNewPeriodMonth(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            value={newPeriodYear}
            onChange={(e) => setNewPeriodYear(e.target.value)}
          />
          <button onClick={handleCreatePeriod}>Create</button>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>KPIs</h2>
        <ul>
          {kpis.map((k) => (
            <li key={k.id}>{k.name}</li>
          ))}
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <input
            placeholder="New KPI"
            value={newKpi}
            onChange={(e) => setNewKpi(e.target.value)}
          />
          <button onClick={handleCreateKpi}>Create</button>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Updates</h2>
        <div>
          <select value={selectedOutlet ?? ''} onChange={(e) => setSelectedOutlet(Number(e.target.value))}>
            <option value="" disabled>Outlet</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <select value={selectedKpi ?? ''} onChange={(e) => setSelectedKpi(Number(e.target.value))}>
            <option value="" disabled>KPI</option>
            {kpis.map((k) => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
          <button onClick={loadUpdates}>Load</button>
        </div>
        <ul>
          {updates.map((u) => (
            <li key={u.id}>{u.period_id}: {u.value} ({u.note ?? ''})</li>
          ))}
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <select value={selectedPeriod ?? ''} onChange={(e) => setSelectedPeriod(Number(e.target.value))}>
            <option value="" disabled>Period</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>{p.year}-{String(p.month).padStart(2, '0')}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Value"
            value={updateValue}
            onChange={(e) => setUpdateValue(e.target.value)}
          />
          <input
            placeholder="Note"
            value={updateNote}
            onChange={(e) => setUpdateNote(e.target.value)}
          />
        <button onClick={handleCreateUpdate}>Add</button>
      </div>
    </section>

    <section style={{ marginTop: '2rem' }}>
      <h2>Metrics</h2>
      <div>
        <select value={selectedOutlet ?? ''} onChange={(e) => setSelectedOutlet(Number(e.target.value))}>
          <option value="" disabled>Outlet</option>
          {outlets.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
        <select value={selectedKpi ?? ''} onChange={(e) => setSelectedKpi(Number(e.target.value))}>
          <option value="" disabled>KPI</option>
          {kpis.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
        <button onClick={loadMetrics}>Load</button>
      </div>
      <ul>
        {metrics.map((m, idx) => (
          <li key={idx}>{m.period}: {m.value}</li>
        ))}
      </ul>
    </section>

    <section style={{ marginTop: '2rem' }}>
      <h2>Feedback</h2>
      <div>
        <select value={feedbackOutlet ?? ''} onChange={(e) => setFeedbackOutlet(Number(e.target.value))}>
          <option value="" disabled>Outlet</option>
          {outlets.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
        <button onClick={loadFeedback}>Load</button>
      </div>
      <ul>
        {feedbacks.map((f) => (
          <li key={f.id}>{f.period_id}: {f.text}</li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <select value={feedbackPeriod ?? ''} onChange={(e) => setFeedbackPeriod(Number(e.target.value))}>
          <option value="" disabled>Period</option>
          {periods.map((p) => (
            <option key={p.id} value={p.id}>{p.year}-{String(p.month).padStart(2, '0')}</option>
          ))}
        </select>
        <input
          placeholder="Feedback"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
        <button onClick={handleCreateFeedback}>Add</button>
      </div>
    </section>

    <section style={{ marginTop: '2rem' }}>
      <h2>Files</h2>
      <div>
        <select value={fileOutlet ?? ''} onChange={(e) => setFileOutlet(Number(e.target.value))}>
          <option value="" disabled>Outlet</option>
          {outlets.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
        <select value={filePeriod ?? ''} onChange={(e) => setFilePeriod(Number(e.target.value))}>
          <option value="" disabled>Period</option>
          {periods.map((p) => (
            <option key={p.id} value={p.id}>{p.year}-{String(p.month).padStart(2, '0')}</option>
          ))}
        </select>
        <button onClick={loadFiles}>Load</button>
      </div>
      <ul>
        {files.map((f) => (
          <li key={f.id}>{f.path}</li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="File path"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <button onClick={handleCreateFile}>Add</button>
      </div>
    </section>
    </div>
  )
}

export default App

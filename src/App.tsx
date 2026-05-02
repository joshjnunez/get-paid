import { useLocalStorage } from './hooks/useLocalStorage'
import { Header } from './components/Header'
import { PointTracker } from './components/PointTracker'
import { EarningsSummary } from './components/EarningsSummary'
import { ProgressTier } from './components/ProgressTier'

function getDefaultMonthLabel(): string {
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function App() {
  const [points, setPoints] = useLocalStorage<number>('gp_points', 0)
  const [monthLabel, setMonthLabel] = useLocalStorage<string>('gp_month', getDefaultMonthLabel())

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="max-w-md mx-auto">
        <Header monthLabel={monthLabel} onMonthLabelChange={setMonthLabel} />

        <div className="px-4 space-y-4">
          <EarningsSummary points={points} />
          <ProgressTier points={points} />
          <PointTracker points={points} onPointsChange={setPoints} />
        </div>
      </div>
    </div>
  )
}

export default App

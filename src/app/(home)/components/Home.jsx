'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { LuPause, LuPlay, LuRotateCcw, LuFlame, LuQuote } from 'react-icons/lu'
import ToDoList from './ToDoList'
import dayjs from 'dayjs'
import { fetchDailySchedule } from '@/app/schedule/action'
import { fetchCourses } from '@/app/courses/action'
import { formatHour, generateTimeSlots } from '@/utils/time'
import { useSession } from 'next-auth/react'
import {
  addProductivityHour,
  fetchDailyQuote,
  fetchFocusedHours,
} from '../action'
import { toast } from 'react-toastify'

// A finished focus block is logged as half an hour by PUT /api/productivity, so Focus stays 30 min.
const MODES = [
  { id: 'focus', label: 'Focus', minutes: 30 },
  { id: 'short', label: 'Short break', minutes: 5 },
  { id: 'long', label: 'Long break', minutes: 15 },
]
const BLOCKS_PER_ROUND = 4

// Five steps like GitHub's graph: none, then four shades by hours that day.
const HEAT = ['#EDEDEF', '#FDE2BD', '#FBC37A', '#F99B26', '#C2650A']
const heatLevel = (h) => (h <= 0 ? 0 : h <= 1 ? 1 : h <= 2 ? 2 : h <= 3 ? 3 : 4)

const Home = ({ user }) => {
  const [mode, setMode] = useState(MODES[0])
  const [timeLeft, setTimeLeft] = useState(MODES[0].minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [blocksDone, setBlocksDone] = useState(0)
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [focusedHours, setFocusedHours] = useState([])
  const [monthlyFocusedHours, setMonthlyFocusedHours] = useState(0)
  const [averageHoursSpent, setAverageHoursSpent] = useState(0)
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [todaySchedules, setTodaySchedules] = useState([])
  const [courses, setCourses] = useState([])

  const { data: session } = useSession()

  const fetchSchedule = async (date) => {
    try {
      const isToday = dayjs(date).isSame(dayjs(), 'day')
      const schedules = await fetchDailySchedule(user, date)
      if (schedules && isToday) {
        setTodaySchedules(
          schedules.map((schedule) => ({
            ...schedule,
            timeSlot: formatHour(dayjs(schedule.date).hour()),
          }))
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchFocusedHoursData = async () => {
    const data = await fetchFocusedHours()
    if (data) {
      setFocusedHours(data.focusedHours ?? [])
      setMonthlyFocusedHours(data.monthlyFocusedHours ?? 0)
      setAverageHoursSpent(data.averageHoursSpent ?? 0)
    }
  }

  const fetchQuote = async () => {
    const quote = await fetchDailyQuote()
    if (quote) {
      setQuote(quote.quote)
      setAuthor(quote.author)
    }
  }

  const timeSlots = generateTimeSlots()
  const futureTimeSlots = timeSlots.filter(
    (slot) =>
      (parseInt(slot) % 12) + (slot.includes('PM') ? 12 : 0) >=
      currentDate.hour()
  )

  useEffect(() => {
    fetchQuote()
    fetchFocusedHoursData()
    setCurrentDate(dayjs())
    fetchSchedule(currentDate.toISOString())
    fetchCourses().then((res) => setCourses(res?.courses || []))
  }, [])

  useEffect(() => {
    if (session) {
      localStorage.setItem('userDetails', JSON.stringify(session.user))
    }
  }, [session])

  // Tick while running; when a block ends, log focus time and move to the next mode.
  useEffect(() => {
    if (!isRunning) return
    if (timeLeft === 0) {
      setIsRunning(false)
      finishBlock()
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, isRunning])

  const switchMode = (next) => {
    setMode(next)
    setTimeLeft(next.minutes * 60)
    setIsRunning(false)
  }

  const finishBlock = async () => {
    if (mode.id === 'focus') {
      await addProductivityHour()
      toast.success('Focus block logged: +30 min')
      fetchFocusedHoursData()
      const done = blocksDone + 1
      setBlocksDone(done)
      switchMode(done % BLOCKS_PER_ROUND === 0 ? MODES[2] : MODES[1])
    } else {
      switchMode(MODES[0])
    }
  }

  const resetTimer = () => {
    setTimeLeft(mode.minutes * 60)
    setIsRunning(false)
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')
  const elapsed = 1 - timeLeft / (mode.minutes * 60)

  const activity = useMemo(() => buildActivity(focusedHours), [focusedHours])

  const doneToday = todaySchedules.filter((s) => s.checked).length
  const firstName = (user?.fullName || session?.user?.fullName || '').split(' ')[0]
  const [hour, setHour] = useState(null)
  useEffect(() => setHour(dayjs().hour()), [])
  const greeting = hour === null ? 'Welcome back' : hour < 11 ? 'Good morning' : hour < 15 ? 'Good afternoon' : hour < 19 ? 'Good evening' : 'Good night'

  const mine = courses
    .map((c) => {
      const progress = c.subscribers?.find((s) => s.studentId === user.id)?.progress?.length || 0
      return { ...c, pct: c.sessions?.length ? Math.round((progress / c.sessions.length) * 100) : 0 }
    })
    .filter((c) => c.pct > 0 && c.pct < 100)
    .sort((a, b) => b.pct - a.pct)

  return (
    <div className='mx-auto max-w-[1200px] space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight'>
          {greeting}{firstName && `, ${firstName}`}
        </h2>
        <p className='mt-1 text-sm text-ink-2'>
          {todaySchedules.length > 0
            ? `${doneToday} of ${todaySchedules.length} tasks done today · ${fmtHours(monthlyFocusedHours)} focused this month`
            : `Nothing scheduled today · ${fmtHours(monthlyFocusedHours)} focused this month`}
        </p>
      </div>

      <div className='grid items-start grid-cols-12 gap-6'>
        <div className='col-span-8 space-y-6'>
        {/* Focus activity: one square per day of the year */}
        <section className='p-6 bg-white border rounded-card border-line'>
          <div className='flex items-baseline justify-between'>
            <h3 className='font-semibold'>
              {fmtHours(activity.total)} focused in {dayjs().year()}
            </h3>
            <div className='flex items-center gap-1.5 text-xs text-ink-3'>
              Less
              {HEAT.map((c) => (
                <span key={c} className='size-[11px] rounded-[3px]' style={{ background: c }} />
              ))}
              More
            </div>
          </div>

          <div className='mt-5 grid grid-cols-[28px_1fr] gap-x-2'>
            <span />
            <div className='relative h-5 text-xs text-ink-3'>
              {activity.months.map((m) => (
                <span key={m.label} className='absolute' style={{ left: `${(m.week / activity.weeks) * 100}%` }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className='grid grid-rows-7 gap-[3px] text-[11px] leading-none text-ink-3'>
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                <span key={i} className='flex items-center'>{d}</span>
              ))}
            </div>
            <div
              className='grid grid-flow-col grid-rows-7 gap-[3px]'
              style={{ gridTemplateColumns: `repeat(${activity.weeks}, minmax(0, 1fr))` }}
              role='img'
              aria-label={`Focus activity for ${dayjs().year()}: ${fmtHours(activity.total)} across ${activity.activeDays} days`}
            >
              {activity.cells.map((cell, i) =>
                cell === null ? (
                  <span key={i} />
                ) : (
                  <span
                    key={i}
                    title={cell.future ? '' : `${cell.hours ? fmtHours(cell.hours) : 'No focus'} on ${cell.date.format('ddd D MMM')}`}
                    className='aspect-square rounded-[3px]'
                    style={{ background: cell.future ? '#F7F7F8' : HEAT[heatLevel(cell.hours)] }}
                  />
                )
              )}
            </div>
          </div>

          <dl className='grid grid-cols-4 pt-5 mt-6 border-t divide-x divide-line border-line'>
            <Stat label='Current streak' value={`${activity.streak} days`} icon={activity.streak > 0} />
            <Stat label='Longest streak' value={`${activity.longest} days`} />
            <Stat label='This month' value={fmtHours(monthlyFocusedHours)} />
            <Stat label='Average on active days' value={fmtHours(averageHoursSpent)} />
          </dl>
        </section>

        {/* Today */}
        <ToDoList
          user={user}
          currentDate={currentDate}
          futureTimeSlots={futureTimeSlots}
          todaySchedules={todaySchedules}
          fetchSchedule={fetchSchedule}
        />
        {/* Quote */}
        <section className='p-6 bg-white border rounded-card border-line'>
          <LuQuote size={20} className='text-focus' aria-hidden />
          <blockquote className='mt-3 text-[15px] leading-relaxed text-ink'>{quote || '…'}</blockquote>
          {author && <p className='mt-3 text-sm text-ink-3'>{author}</p>}
        </section>
        </div>

        <div className='col-span-4 space-y-6'>
        {/* Pomodoro */}
        <section className='flex flex-col p-6 bg-white border rounded-card border-line'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>Focus timer</h3>
            <span className='text-xs text-ink-3 tnum'>
              Round {Math.floor(blocksDone / BLOCKS_PER_ROUND) + 1}
            </span>
          </div>
          <div role='tablist' aria-label='Timer mode' className='grid grid-cols-3 p-1 mt-4 rounded-lg bg-page'>
            {MODES.map((m) => (
              <button
                key={m.id}
                role='tab'
                aria-selected={mode.id === m.id}
                onClick={() => switchMode(m)}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors ${mode.id === m.id ? 'bg-white text-ink shadow-sm' : 'text-ink-2 hover:text-ink'}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className='relative grid my-6 place-items-center'>
            <svg viewBox='0 0 120 120' className='w-52 h-52 -rotate-90' aria-hidden>
              <circle cx='60' cy='60' r='54' fill='none' stroke='#F1F1F3' strokeWidth='6' />
              <circle
                cx='60' cy='60' r='54' fill='none'
                stroke={mode.id === 'focus' ? '#F99B26' : '#4F55DA'}
                strokeWidth='6' strokeLinecap='round'
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - elapsed)}
                className='transition-[stroke-dashoffset] duration-1000 ease-linear'
              />
            </svg>
            <div className='absolute text-center'>
              <p className='text-5xl font-semibold tracking-tight tnum'>{mm}:{ss}</p>
              <p className='mt-1 text-sm text-ink-3'>{isRunning ? (mode.id === 'focus' ? 'Stay with it' : 'Step away') : 'Paused'}</p>
            </div>
          </div>

          <div className='flex justify-center gap-1.5 mb-5' aria-label={`${blocksDone % BLOCKS_PER_ROUND} of ${BLOCKS_PER_ROUND} focus blocks this round`}>
            {Array.from({ length: BLOCKS_PER_ROUND }, (_, i) => (
              <span key={i} className={`h-1.5 w-6 rounded-full ${i < blocksDone % BLOCKS_PER_ROUND ? 'bg-focus' : 'bg-line'}`} />
            ))}
          </div>

          <div className='flex gap-2 mt-auto'>
            <button
              onClick={() => setIsRunning((r) => !r)}
              className='flex items-center justify-center flex-1 h-10 gap-2 text-sm font-medium text-white rounded-lg bg-ink hover:bg-black'
            >
              {isRunning ? <LuPause size={16} /> : <LuPlay size={16} />}
              {isRunning ? 'Pause' : timeLeft < mode.minutes * 60 ? 'Resume' : `Start ${mode.label.toLowerCase()}`}
            </button>
            <button onClick={resetTimer} aria-label='Reset timer' className='grid border rounded-lg size-10 place-items-center border-line text-ink-2 hover:bg-page'>
              <LuRotateCcw size={16} />
            </button>
          </div>
          <p className='mt-3 text-xs text-center text-ink-3'>Each finished focus block adds 30 min to your graph.</p>
        </section>

        {/* Continue learning */}
        <section className='p-6 bg-white border rounded-card border-line'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>Continue learning</h3>
            <Link href='/courses' className='text-sm font-medium text-accent hover:underline'>All courses</Link>
          </div>
          {mine.length === 0 ? (
            <p className='mt-4 text-sm text-ink-2'>Courses you start show up here.</p>
          ) : (
            <ul className='mt-4 space-y-4 list-none'>
              {mine.slice(0, 3).map((c) => (
                <li key={c._id}>
                  <Link href={`/courses/${c._id}`} className='flex gap-3 group'>
                    {c.thumbnail ? (
                      <img src={c.thumbnail} alt='' className='object-cover w-20 rounded-md aspect-video shrink-0 bg-page' />
                    ) : (
                      <span className='grid w-20 font-semibold rounded-md aspect-video shrink-0 place-items-center bg-accent-wash text-accent' aria-hidden>{c.title.charAt(0)}</span>
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium leading-snug line-clamp-2 group-hover:text-accent'>{c.title}</p>
                      <div className='flex items-center gap-2 mt-2'>
                        <div className='flex-1 h-1 rounded-full bg-line'>
                          <div className='h-1 rounded-full bg-accent' style={{ width: `${c.pct}%` }} />
                        </div>
                        <span className='text-xs text-ink-3 tnum'>{c.pct}%</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, icon }) {
  return (
    <div className='px-4 first:pl-0'>
      <dt className='text-xs text-ink-3'>{label}</dt>
      <dd className='flex items-center gap-1.5 mt-1 text-lg font-semibold tnum'>
        {icon && <LuFlame size={16} className='text-focus' aria-hidden />}
        {value}
      </dd>
    </div>
  )
}

function fmtHours(h) {
  const n = Math.round((h || 0) * 10) / 10
  return `${n % 1 === 0 ? n : n.toFixed(1)} h`
}

// Cells for the calendar year, Sunday-first columns like GitHub; streaks count days with any focus.
function buildActivity(logs) {
  const start = dayjs().startOf('year')
  const today = dayjs().startOf('day')
  const days = dayjs().endOf('year').diff(start, 'day') + 1
  const byDay = new Map(
    (logs ?? []).map((log) => [dayjs(log.date).format('YYYY-MM-DD'), log.focusedHours])
  )
  const cells = Array(start.day()).fill(null)
  let total = 0, activeDays = 0, run = 0, longest = 0
  for (let d = 0; d < days; d++) {
    const date = start.add(d, 'day')
    const future = date.isAfter(today)
    const hours = future ? 0 : byDay.get(date.format('YYYY-MM-DD')) ?? 0
    cells.push({ date, hours, future })
    if (future) continue
    total += hours
    if (hours > 0) { activeDays++; run++; longest = Math.max(longest, run) } else if (!date.isSame(today)) run = 0
  }
  const months = Array.from({ length: 12 }, (_, m) => {
    const first = start.month(m).startOf('month')
    return { label: first.format('MMM'), week: Math.floor((start.day() + first.diff(start, 'day')) / 7) }
  })
  return { cells, months, weeks: Math.ceil(cells.length / 7), total, activeDays, streak: run, longest }
}

export default Home

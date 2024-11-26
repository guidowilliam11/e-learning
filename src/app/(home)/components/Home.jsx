'use client'

import { useState, useEffect } from 'react'
import { MdPause, MdPlayArrow, MdRefresh } from 'react-icons/md'

const Home = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Todo 1', checked: false },
    { id: 2, text: 'Todo 2', checked: false },
    { id: 3, text: 'Todo 3', checked: false },
    { id: 4, text: 'Todo 4', checked: false },
  ])

  const [newTodo, setNewTodo] = useState('')

  const handleCheckboxChange = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    )
  }

  const handleAddNewTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([
        ...todos,
        { id: todos.length + 1, text: newTodo, checked: false },
      ])
      setNewTodo('') // Clear the input
    }
  }

  // Timer state
  const initialTime = 1 * 60 // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      return () => clearInterval(timer) // Clear timer on component unmount
    }
  }, [timeLeft, isPaused])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const resetTimer = () => {
    setTimeLeft(initialTime)
    setIsPaused(false)
  }

  const progress = (timeLeft / initialTime) * 100

  return (
    <>
      <div className='flex flex-grow h-full gap-4'>
        <div className='flex-grow flex flex-col w-[33.33%] h-full gap-4'>
          {/* Monthly Focused Hours */}
          <div className='flex flex-col justify-between bg-[#545EE1] text-white rounded-lg p-6 h-[23%]'>
            <h2 className='mb-2 text-lg font-semibold '>
              Monthly Focused Hours
            </h2>
            <p className='content-center flex-grow text-6xl font-bold text-start'>
              703.23h
            </p>
          </div>

          {/* Productivity Level */}
          <div className='flex flex-col justify-between bg-white rounded-lg shadow-md p-6 text-center items-start  h-[23%]'>
            <h2 className='mb-5 text-lg font-semibold'>Productivity Level</h2>
            <p className='content-center flex-grow text-6xl font-bold text-start'>
              18 / 20
            </p>
          </div>

          {/* Today's Motivation */}
          <div className=' bg-white rounded-lg shadow-md p-6  h-[54%]'>
            <h2 className='mb-4 text-lg font-semibold'>
              Today&apos;s Motivation
            </h2>
            <div className='w-full h-32 mb-4 bg-gray-200 rounded'></div>
            <p className='text-gray-500'>
              Why does the picture above motivate you?...
            </p>
          </div>
        </div>

        <div className='w-[66.66%] h-full'>
          <div className='flex flex-grow h-[69%] w-auto gap-4 mb-4'>
            <div className='flex flex-col w-[50%] gap-4 h-[100%]'>
              {/* Today's To-Do List */}
              <div className=' bg-white rounded-lg shadow-md p-6 h-[69%] overflow-y-auto'>
                <h2 className='mb-4 text-lg font-semibold'>
                  Today&apos;s To-Do List
                </h2>
                <ul className='space-y-4'>
                  {todos.map((todo) => (
                    <li key={todo.id} className='flex items-center space-x-3'>
                      <input
                        type='checkbox'
                        id={`todo-${todo.id}`}
                        checked={todo.checked}
                        onChange={() => handleCheckboxChange(todo.id)}
                        className='w-5 h-5 border-2 border-orange-500 rounded-full appearance-none cursor-pointer checked:bg-orange-500 checked:border-transparent'
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className='text-gray-800'
                      >
                        {todo.text}
                      </label>
                    </li>
                  ))}
                </ul>

                <div className='flex items-center mt-4 space-x-3'>
                  <input
                    type='checkbox'
                    className='w-5 h-5 border-2 border-gray-400 rounded-full appearance-none cursor-not-allowed'
                    disabled
                  />
                  <input
                    type='text'
                    placeholder='Type here...'
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className='w-full px-3 py-1 text-sm border rounded'
                  />
                </div>

                <button
                  onClick={handleAddNewTodo}
                  className='flex items-center mt-2 text-gray-500'
                >
                  <span className='mr-2 text-xl'>+</span> Add new
                </button>
              </div>

              {/* Quote of the Day */}
              <div className=' bg-[#545EE1] text-white rounded-lg p-6 text-center h-[31%]'>
                <h2 className='mb-2 text-lg font-semibold'>Quote Of The Day</h2>
                <p className='italic text-md'>
                  &quot;I am blessed with a funny gene that makes me enjoy
                  life.&quot;
                </p>
                <p className='mt-1'>- Karan Patel</p>
              </div>
            </div>

            <div className='flex flex-col w-[50%] h-[100%]'>
              {/* Ongoing Timer */}
              <div className='bg-[#545EE1] text-white rounded-lg p-6 px-10 flex flex-col items-center justify-center text-center h-full relative'>
                <h2 className='mb-2 text-lg font-semibold'>Ongoing Timer</h2>
                <div className='relative flex items-center justify-center w-full h-full rounded-full bg-none'>
                  <svg
                    className='absolute inset-0 w-full h-full'
                    viewBox='0 0 100 100'
                  >
                    <circle
                      cx='50'
                      cy='50'
                      r='45'
                      stroke='#E6E6FA' // Light purple trail
                      strokeWidth='4'
                      fill='none'
                      className='opacity-20'
                    />
                    <circle
                      cx='50'
                      cy='50'
                      r='45'
                      stroke='white' // White moving circle
                      strokeWidth='4'
                      fill='none'
                      strokeDasharray='283' // Circumference of the circle (2 * π * r)
                      strokeDashoffset={`${(283 * (100 + progress)) / 100}`}
                      className='transition-all duration-1000'
                    />
                  </svg>
                  <div className='relative text-5xl font-bold group'>
                    {/* Timer text, hidden when buttons are visible on hover */}
                    <div className='inset-2 hover:text-[#545EE1] transition-opacity duration-300 opacity-100 group-hover:opacity-0'>
                      {formatTime(timeLeft)}
                    </div>

                    {/* Button group, shown on hover */}
                    <div className='absolute flex items-center justify-center transition-opacity duration-300 opacity-0 inset-1 group-hover:opacity-100'>
                      <button onClick={togglePause} className='mx-2 text-white'>
                        {isPaused ? (
                          <MdPlayArrow size={38} />
                        ) : (
                          <MdPause size={38} />
                        )}
                      </button>
                      <button onClick={resetTimer} className='mx-2 text-white'>
                        <MdRefresh size={38} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Level */}
          <div className='bg-white rounded-lg shadow-md p-6 h-[29%]'>
            <h2 className='mb-4 text-lg font-semibold'>Performance Level</h2>
            <div className='flex justify-between mt-4 text-sm text-gray-500'>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
            <div className='flex flex-wrap gap-1'>
              {Array.from({ length: 60 * 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 ${
                    i % 5 === 0 ? 'bg-orange-500' : 'bg-gray-300'
                  } rounded-sm`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

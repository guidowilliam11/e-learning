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
  const initialTime = 30 * 60
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isPaused, setIsPaused] = useState(false)
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [focusedHours, setFocusedHours] = useState([]);
  const [monthlyFocusedHours, setMonthlyFocusedHours] = useState(0);
  const [averageHoursSpent, setAverageHoursSpent] = useState(0);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
          headers: {
            'X-Api-Key': 'xWs/pH9MclhuL0xsgCPPQw==fLz9tiV7Uh3ec1Ln',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const fetchedQuote = data[0];
        console.log(fetchedQuote)
        setQuote(fetchedQuote.quote);
        setAuthor(fetchedQuote.author);
      } catch (err) {
        console.log("error");
      }
    }
    fetchQuote();
  }, [])

  useEffect(() => {
    const fetchFocusedHours = async () => {
      try {
        const response = await fetch('/api/productivity'); // Replace with the correct API endpoint
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setFocusedHours(data.focusedHours);
        setMonthlyFocusedHours(data.monthlyFocusedHours);
        setAverageHoursSpent(data.averageHoursSpent);
      } catch (err) {
        throw new Error(`Error: ${err}`);
      }
    };

    fetchFocusedHours();
  }, []);


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

  async function addProductivityHour() {
    try {
      const response = await fetch('/api/productivity', {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Productivity hour added successfully:', data);
    } catch (error) {
      console.error('Failed to add productivity hour:', error.message);
    }
  }


  const resetTimer = () => {
    addProductivityHour()
    setTimeLeft(initialTime)
    setIsPaused(false)
  }

  const progress = (timeLeft / initialTime) * 100

  return (
    <>
      <div className='flex flex-grow h-full gap-2'>
        <div className='flex-grow flex flex-col w-1/3 h-full'>
          <div className='flex gap-2 flex-col h-[45%]'>
            {/* Monthly Focused Hours */}
            <div className='flex flex-col justify-between bg-[#545EE1] text-white rounded-lg p-4 h-1/2'>
              <h2 className='mb-2 text-lg font-semibold '>
                Monthly Focused Hours
              </h2>
              <p className='content-center flex-grow text-6xl font-bold text-start'>
                {monthlyFocusedHours} h
              </p>
            </div>

            {/* Productivity Level */}
            <div className='flex flex-col justify-between bg-white rounded-lg shadow-md p-4 text-center items-start  h-1/2'>
              <h2 className='mb-5 text-lg font-semibold'>Productivity Level</h2>
              <p className='content-center flex-grow text-6xl font-bold text-start'>
                18 / 20
              </p>
            </div>
          </div>

          {/* Today's Motivation */}
          <div className=' bg-white rounded-lg shadow-md p-4 mt-2 flex flex-grow flex-col'>
            <h2 className='mb-4 text-lg font-semibold'>
              Today&apos;s Motivation
            </h2>
            <img src="https://static.vecteezy.com/system/resources/thumbnails/008/843/028/small/silhouette-man-jumping-over-the-cliffs-with-i-can-do-it-word-in-sunlight-never-give-up-good-mindset-concept-photo.jpg" className='w-full h-32 mb-4 bg-gray-200 rounded'></img>
            <p className='text-gray-500'>
              Why does the picture above motivate you?...
            </p>
          </div>
        </div>

        <div className='w-2/3 h-full'>
          <div className="flex flex-grow w-auto gap-2 mb-2"
               style={{ height: 'calc(67.5% + 0.5rem)' }}>
            <div className='flex flex-col w-[50%] gap-2'>
              {/* Today's To-Do List */}
              <div className=' bg-white rounded-lg shadow-md p-4 h-2/3 overflow-y-auto'>
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
              <div className=' flex flex-col justify-evenly bg-[#545EE1] text-white rounded-lg p-4 text-center h-1/3'>
                <h2 className='mb-2 text-md font-semibold'>Quote Of The Day</h2>
                <p className='italic text-md'>
                  {quote}
                </p>
                <p className='mt-1 text-xs'>- {author}</p>
              </div>
            </div>

            <div className='flex flex-col w-[50%]'>
              {/* Ongoing Timer */}
              <div className='bg-[#545EE1] text-white rounded-lg p-4 px-10 flex flex-col items-center justify-center text-center h-full relative'>
                <h2 className='mb-2 text-2xl font-semibold'>Productivity Timer</h2>
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
                      strokeDasharray='283'
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
          <div className='flex flex-col bg-white rounded-lg shadow-md px-4 py-3 h-auto'>
            <h2 className='text-lg font-semibold'>Performance Level</h2>
            <div className='flex justify-between text-sm text-gray-500'>
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
            <div className="flex flex-wrap gap-1">
              {Array.from({length: 365}).map((_, i) => {
                // Determine the focused hours for the current day
                const focusedHour = focusedHours[i]?.focusedHours || 0;

                // Calculate transparency level (0 to 1)
                const transparency = focusedHour > 0
                    ? Math.min(focusedHour / averageHoursSpent, 1)
                    : 0.1; // Default minimum transparency for gray boxes

                return (
                    <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: `rgba(255, 165, 0, ${transparency})`, // Orange with transparency
                        }}
                    ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

"use client";

import { useState } from 'react';
import { eachDayOfInterval, format } from 'date-fns';
import Image from "next/image";

export default function Home() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Todo 1", checked: false },
    { id: 2, text: "Todo 2", checked: false },
    { id: 3, text: "Todo 3", checked: false },
    { id: 4, text: "Todo 4", checked: false }
  ]);

  const [newTodo, setNewTodo] = useState("");

  const handleCheckboxChange = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const handleAddNewTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: todos.length + 1, text: newTodo, checked: false },
      ]);
      setNewTodo(""); // Clear the input
    }
  };

  return (<>
    <div className="flex-grow h-full flex gap-4">
      <div className='flex-grow flex flex-col w-[33.33%] h-full gap-4'>
        {/* Monthly Focused Hours (1,1) */}
        <div className="flex flex-col justify-between bg-[#545EE1] text-white rounded-lg p-6 h-[23%]">
          <h2 className="text-lg font-semibold mb-2 ">Monthly Focused Hours</h2>
          <p className="flex-grow text-start content-center text-6xl font-bold">703.23h</p>
        </div>

        {/* Monthly Focused Hours 2 (2,1) */}
        <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-6 text-center items-start  h-[23%]">
          <h2 className="text-lg font-semibold mb-5">Productivity Level</h2>
          <p className="flex-grow text-start content-center text-6xl font-bold">18 / 20</p>
        </div>

        {/* Today's Motivation (3-4, 1) */}
        <div className=" bg-white rounded-lg shadow-md p-6  h-[54%]">
          <h2 className="text-lg font-semibold mb-4">Today's Motivation</h2>
          <div className="bg-gray-200 w-full h-32 mb-4 rounded"></div>
          <p className="text-gray-500">Why does the picture above motivate you?...</p>
        </div>
      </div>

      <div className='w-[66.66%] h-full'>
        <div className='flex flex-grow h-[69%] w-auto gap-4 mb-4'>
          <div className='flex flex-col w-[50%] gap-4 h-[100%]'>
            {/* Today's To-Do List (1-2, 2) */}
            <div className=" bg-white rounded-lg shadow-md p-6 h-[69%]">
              <h2 className="text-lg font-semibold mb-4">Today's To-Do List</h2>
              <ul className="space-y-4">
                {/* Checklist Items */}
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      checked={todo.checked}
                      onChange={() => handleCheckboxChange(todo.id)}
                      className="appearance-none h-5 w-5 border-2 border-orange-500 rounded-full checked:bg-orange-500 checked:border-transparent cursor-pointer"
                    />
                    <label htmlFor={`todo-${todo.id}`} className="text-gray-800">
                      {todo.text}
                    </label>
                  </li>
                ))}
              </ul>

              {/* Input for New Todo Item */}
              <div className="flex items-center space-x-3 mt-4">
                <input
                  type="checkbox"
                  className="appearance-none h-5 w-5 border-2 border-gray-400 rounded-full cursor-not-allowed"
                  disabled
                />
                <input
                  type="text"
                  placeholder="Type here..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="w-full border rounded px-3 py-1 text-sm"
                />
              </div>

              {/* Add New Button */}
              <button
                onClick={handleAddNewTodo}
                className="text-gray-500 mt-2 flex items-center"
              >
                <span className="text-xl mr-2">+</span> Add new
              </button>
            </div>

            {/* Quote of the Day (3, 2) */}
            <div className=" bg-[#545EE1] text-white rounded-lg p-6 text-center h-[31%]">
              <h2 className="text-lg font-semibold mb-4">Quote Of The Day</h2>
              <p className="text-md italic">"I am blessed with a funny gene that makes me enjoy life."</p>
              <p className="mt-2">- Karan Patel</p>
            </div>
          </div>

          <div className='flex flex-col w-[50%] h-[100%]'>
            {/* Ongoing Timer (1-3, 3) */}
            <div className="bg-[#545EE1] text-white rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
              <h2 className="text-lg font-semibold mb-2">Ongoing Timer</h2>
              <div className="text-5xl font-bold">30:00</div>
              <p className="mt-2">assignment</p>
            </div>
          </div>
        </div>

        {/* Performance Level (4, 2-3) */}
        <div className="bg-white rounded-lg shadow-md p-6 h-[29%]">
          <h2 className="text-lg font-semibold mb-4">Performance Level</h2>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
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
            {Array.from({ length: 60 * 6 }).map((_, i) => (
              <div key={i} className={`w-3 h-3 ${i % 5 === 0 ? 'bg-orange-500' : 'bg-gray-300'} rounded-sm`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
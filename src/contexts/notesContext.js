"use client"

import { createContext, useContext, useState } from "react"

const NotesContext = createContext(null)

export const NotesContextProvider = ({ children }) => {
  const [notesData, setNotesData] = useState([])

  return <>
    <NotesContext.Provider
      value={{
        notesData,
        setNotesData
      }}
    >
      {children}
    </NotesContext.Provider>
  </>
}

export const useNotesContext = () => {
  return useContext(NotesContext)
}
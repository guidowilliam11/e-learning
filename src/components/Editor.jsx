import '../app/notes/notes.scss'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useCallback, useEffect, useState } from 'react'
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatUnderlined,
  MdShare
} from "react-icons/md";
import { TbHeading } from "react-icons/tb";
import {useSession} from "next-auth/react";


const colors = [
  '#958DF1',
  '#F98181',
  '#FBBC88',
  '#FAF594',
  '#70CFF8',
  '#94FADB',
  '#B9F18D',
  '#C3E2C2',
  '#EAECCC',
  '#AFC8AD',
  '#EEC759',
  '#9BB8CD',
  '#FF90BC',
  '#FFC0D9',
  '#DC8686',
  '#7ED7C1',
  '#F3EEEA',
  '#89B9AD',
  '#D0BFFF',
  '#FFF8C9',
  '#CBFFA9',
  '#9BABB8',
  '#E3F4F4',
]

const defaultContent = `
  <p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p>
  <p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p>
`

const getRandomElement = list => list[Math.floor(Math.random() * list.length)]

const getRandomColor = () => getRandomElement(colors)

const Editor = ({
  ydoc, provider, room, user
}) => {
  const getInitialUser = () => {
    return {
      name: user.name,
      color: getRandomColor(),
    }
  }
  const [status, setStatus] = useState('connecting')
  const [currentUser, setCurrentUser] = useState(getInitialUser)
  const [modal, setModal] = useState(false)
  const [uuid, setUuid] = useState('');
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkingAuth = async () => {
      try {
        const response = await fetch('/api/folder/notes/' + room.split('-')[4]); // Adjust endpoint if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched notes data:", data);
        setAuth(true);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        setAuth(false);
      }
    };

    checkingAuth();
  }, []);

  async function addColaborator(noteId, collaboratorId) {
    try {
      const response = await fetch('/api/folder/notes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({noteId, collaboratorId}),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add collaborator');
      }

      return result;
    } catch (error) {
      console.error('Error adding collaborator:', error);
      throw error;
    }
  }

  const handleShare = () => {
    if (uuid.trim() === '') {
      alert('Please enter a valid UUID.');
      return;
    }

    const noteId = room.split('-')[4];

    addColaborator(noteId, uuid);

    setModal(false);
  };


  const editor = useEditor({
    enableContentCheck: true,
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration()
    },
    onCreate: ({ editor: currentEditor }) => {
      provider.on('synced', () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent(defaultContent)
        }
      })
    },
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      Underline,
      CharacterCount.extend().configure({
        limit: 10000,
      }),
      Collaboration.extend().configure({
        document: ydoc,
      }),
      CollaborationCursor.extend().configure({
        provider,
      }),
    ],
  })

  useEffect(() => {
    // Update status changes
    const statusHandler = event => {
      setStatus(event.status)
    }

    provider.on('status', statusHandler)

    return () => {
      provider.off('status', statusHandler)
    }
  }, [provider])

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      editor.chain().focus().updateUser(currentUser).run()
    }
  }, [editor, currentUser])

  const setName = useCallback(() => {
    const name = (window.prompt('Name', currentUser.name) || '').trim().substring(0, 32)

    if (name) {
      return setCurrentUser({ ...currentUser, name })
    }
  }, [currentUser])

  if (!editor) {
    return null
  }


  
  return (
    <div className="relative flex flex-col h-full">
      {/* Modal */}
      {modal && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Share Your Notes</h2>

              <label htmlFor="uuid" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Friend&#39;s UUID
              </label>
              <input
                  type="text"
                  id="uuid"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter UUID here"
              />

              <div className="flex justify-end mt-4">
                <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                    onClick={() => setModal(false)}
                >
                  Cancel
                </button>
                <button
                    className="bg-[#F99B26] text-white px-4 py-2 rounded hover:bg-primaryDark"
                    onClick={handleShare}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
      )}
      <div className="sticky top-0 flex bg-white rounded-md p-3 gap-3 z-10">
        <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatBold size={20}/>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatItalic size={20}/>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatUnderlined size={20}/>
        </button>
        <div className="h-full w-1 mx-1 border-l  border-gray-500"></div>
        <button
            onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
            className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <TbHeading size={20}/>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatListBulleted size={20}/>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatListNumbered size={20}/>
        </button>
        <div className="h-full w-1 mx-1 border-l  border-gray-500"></div>
        <button
            onClick={() => setModal(true)}
            className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdShare size={20}/>
        </button>
      </div>

      <div className='overflow-y-auto h-[1500px]'>
        <div className='p-4 bg-white shadow-md border border-gray-300 rounded-md mt-4 mx-auto w-3/4'>
          {auth ? (
              <EditorContent editor={editor} className='focus:border-none' />
          ) : (
              <div>
                Not authorized
              </div>
          )
          }
        </div>
    </div>

      <div className='sticky bottom-0 flex bg-white rounded-md p-3 gap-3 z-10'>
        <div
            className="collab-status-group"
            data-state={status === 'connected' ? 'online' : 'offline'}
        >
            <label>
            {status === 'connected'
                ? `${editor.storage.collaborationCursor.users.length} user${
                editor.storage.collaborationCursor.users.length === 1 ? '' : 's'
                } online in ${room}`
                : 'offline'}
            </label>
            <button style={{ '--color': currentUser.color }} onClick={setName}>
            ✎ {currentUser.name}
            </button>
        </div>
      </div>
    </div>
  )
}

export default Editor
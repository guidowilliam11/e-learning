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

const defaultContent = '<p></p>'

const getRandomElement = list => list[Math.floor(Math.random() * list.length)]

const getRandomColor = () => getRandomElement(colors)

const Editor = ({
  ydoc, provider, room, user
}) => {
  const getInitialUser = () => {
    return {
      name: user.fullName,
      color: getRandomColor(),
    }
  }
  const [status, setStatus] = useState('connecting')
  const [currentUser, setCurrentUser] = useState(getInitialUser)
  const [modal, setModal] = useState(false)
  const [email, setEmail] = useState('');
  const [auth, setAuth] = useState(false);
  const [note, setNote] = useState(null);

  useEffect(() => {
    const checkingAuth = async () => {
      try {
        const response = await fetch('/api/folder/notes/' + room.split('-')[4]);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNote(data.note);
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
        body: JSON.stringify({noteId, email}),
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
    if (email.trim() === '') {
      alert('Please enter a valid Email.');
      return;
    }

    const noteId = room.split('-')[4];

    addColaborator(noteId, email);

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


  
  const Tool = ({ label, active, onClick, children }) => (
    <button type="button" aria-label={label} title={label} aria-pressed={!!active} onClick={onClick}
      className={`grid size-8 place-items-center rounded-md ${active ? 'bg-accent-wash text-accent' : 'text-ink-2 hover:bg-page hover:text-ink'}`}>
      {children}
    </button>
  )
  const online = editor.storage.collaborationCursor.users.length

  return (
    <div className="relative flex flex-col h-full gap-4">
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40" role="dialog" aria-modal="true" aria-labelledby="share-title">
          <div className="p-6 bg-white shadow-xl rounded-card w-[400px]">
            <h2 id="share-title" className="text-lg font-semibold">Share this note</h2>
            <p className="mt-1 text-sm text-ink-2">They can edit it with you in real time.</p>
            <label htmlFor="email" className="block mt-5 mb-1.5 text-sm font-medium">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@school.edu"
              className="w-full px-3 text-sm border rounded-md h-9 border-line focus:outline-none focus:border-accent" />
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 text-sm font-medium border rounded-md h-9 border-line hover:bg-page" onClick={() => setModal(false)}>Cancel</button>
              <button className="px-4 text-sm font-medium text-white rounded-md h-9 bg-accent hover:bg-accent-hover" onClick={handleShare}>Share</button>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 flex items-center gap-1 px-3 bg-white border h-12 rounded-card border-line shrink-0">
        <Tool label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><MdFormatBold size={18} /></Tool>
        <Tool label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><MdFormatItalic size={18} /></Tool>
        <Tool label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><MdFormatUnderlined size={18} /></Tool>
        <span className="w-px h-5 mx-2 bg-line" />
        <Tool label="Heading" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><TbHeading size={18} /></Tool>
        <Tool label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><MdFormatListBulleted size={18} /></Tool>
        <Tool label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><MdFormatListNumbered size={18} /></Tool>

        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1.5 text-xs text-ink-3">
            <span className={`size-2 rounded-full ${status === 'connected' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
            {status === 'connected' ? `${online} online` : 'Offline, changes stay on this device'}
          </span>
          <button onClick={setName} title="Name shown on your cursor" className="flex items-center gap-1.5 h-8 px-2 text-xs font-medium rounded-md hover:bg-page">
            <span className="rounded-full size-2.5" style={{ background: currentUser.color }} />{currentUser.name}
          </button>
          <button onClick={() => setModal(true)} className="flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-white rounded-md bg-accent hover:bg-accent-hover">
            <MdShare size={15} /> Share
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto max-w-[780px] min-h-full px-14 py-12 bg-white border rounded-card border-line">
          {note && (
            <header className="pb-6 mb-8 border-b border-line">
              <h1 className="text-3xl font-semibold tracking-tight">{note.topic}</h1>
              <p className="mt-2 text-sm text-ink-3">
                {note.collaborators?.length ? `Shared with ${note.collaborators.length}` : 'Private'} · Edited {new Date(note.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </header>
          )}
          {auth ? (
            <EditorContent editor={editor} className="text-[15px] leading-7" />
          ) : (
            <p className="text-sm text-ink-2">You don&apos;t have access to this note. Ask its owner to share it with you.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Editor
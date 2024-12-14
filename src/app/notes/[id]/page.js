"use client"

import { useEffect, useState } from 'react';
import { TiptapCollabProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'

import Editor from '../../../components/Editor'

const appId = '7j9y6m10'

const App = () => {
  const [room, setRoom] = useState('');
  const [ydocA, setYdocA] = useState(null);
  const [providerA, setProviderA] = useState(null);

  useEffect(() => {
    const currentPath = window.location.pathname.replace(/\//g, "-");
    const newRoom = `collab-room-${currentPath}`;
    setRoom(newRoom);

    // Re-initialize ydoc and provider whenever the URL changes
    const newYdocA = new Y.Doc();
    const newProviderA = new TiptapCollabProvider({
      appId,
      name: newRoom,
      document: newYdocA,
    });

    // Set the new ydoc and provider to state
    setYdocA(newYdocA);
    setProviderA(newProviderA);
  }, [window.location.pathname]); // Runs every time the URL changes

  if (!ydocA || !providerA) {
    return <div>Loading...</div>; // Show loading state while ydocA and providerA are being set up
  }

  return (
    <div className='h-full'>
      <Editor provider={providerA} ydoc={ydocA} room={room} />
    </div>
  )
}

export default App

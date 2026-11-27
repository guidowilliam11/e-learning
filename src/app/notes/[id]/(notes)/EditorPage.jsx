"use client"

import { useEffect, useState } from 'react';
import { TiptapCollabProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'

import Editor from '../../../../components/Editor'

const appId = '7j9y6m10'

const App = ({user}) => {
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
    return <div className="h-64 bg-white border rounded-card border-line animate-pulse" />;
  }

  return (
    <div className='h-full'>
      <Editor provider={providerA} ydoc={ydocA} room={room} user={user}/>
    </div>
  )
}

export default App

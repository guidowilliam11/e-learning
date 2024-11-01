"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { useEffect, useState } from "react";
import { MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdFormatListNumbered, MdFormatUnderlined } from "react-icons/md";
import { TbHeading } from "react-icons/tb";

const colors = ["#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8"];
const names = ["Alice", "Bob", "Carol", "Dave", "Eve"];

const getRandomElement = (list) => list[Math.floor(Math.random() * list.length)];

const CollaborativeEditor = () => {
  const [currentUser] = useState({
    name: getRandomElement(names),
    color: getRandomElement(colors),
  });
  const [status, setStatus] = useState("connecting");
  const currentPath = window.location.pathname.replace(/\//g, "-");
  const room = `collab-room-${currentPath}`;

  // Create a Yjs document and TiptapCollabProvider for Hocuspocus
  const ydoc = new Y.Doc();
  const provider = new TiptapCollabProvider({
    appId: '7j9y6m10',  // Replace with your actual Hocuspocus app ID if you have one
    name: room,
    document: ydoc,
    websocketUrl: "ws://localhost:1234",  // Local Hocuspocus server URL
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        user: currentUser,
      }),
    ],
    content: "<p>Hello! Start typing to collaborate...</p>",
  });

  useEffect(() => {
    console.log(provider)
    provider.on('status', (event) => setStatus(event.status));
    return () => provider.off('status');
  }, [provider]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatBold size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatItalic size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatUnderlined size={20} />
        </button>
        <div className="h-full w-1 mx-1 border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <TbHeading size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatListBulleted size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="p-2 mx-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <MdFormatListNumbered size={20} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-grow p-8 overflow-y-auto bg-white shadow-md border border-gray-300 rounded-md mt-4 mx-auto w-3/4">
        <EditorContent editor={editor} />
      </div>

      {/* Collaboration Status */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm flex justify-between items-center">
        <span>{status}</span>
        <span style={{ color: currentUser.color }}>{currentUser.name}</span>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
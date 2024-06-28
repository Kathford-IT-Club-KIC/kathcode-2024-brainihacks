import React from 'react'
import Sidebar from './components/Chats/Sidebar'
import ChatArea from './components/Chats/ChatArea'

export default function Inbox() {
  return (
    <div className='flex gap-4 w-[100vw] border border-black p-5 rounded-lg'>
      <Sidebar className='flex-1 border-black'/>
      <ChatArea className='flex-3'/>
    </div>
  )
}

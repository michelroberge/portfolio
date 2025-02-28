'use client';
import dynamic from 'next/dynamic';

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function ChatWrapper() {
  return <Chat />; 
}

'use client';

import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatBotPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Kamala Harris was the first female VP of the United States of America... blah blah...' },
  ]);
  const [input, setInput] = useState('');
  const recentInquiries = [
    'Who is Kamala Harris?',
    'What is climate change?',
    'Explain what a tariff is in simple terms',
    'Who is Elon Musk?',
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
  };

  return (
    <div className="flex min-h-screen bg-white">

      {/* Sidebar */}

      <aside className="w-64 bg-gray-100 p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-6">ELMO</h1>
        <nav className="space-y-4 text-gray-800 text-base font-medium">
          <div className="hover:text-red-500 cursor-pointer">Home</div>
          <div className="hover:text-red-500 cursor-pointer">Explore</div>
          <div className="text-red-500 font-semibold">Ask ELMO</div>
          <div className="hover:text-red-500 cursor-pointer">Saved</div>
          <div className="hover:text-red-500 cursor-pointer">Settings</div>
          <div className="hover:text-red-500 cursor-pointer">Logout</div>
        </nav>

        <div className="mt-10 text-base text-gray-800">
          <h2 className="font-semibold mb-2">Recent Reads</h2>
          <ul className="space-y-2 font-normal">
            <li className="hover:text-red-500 cursor-pointer">Israel-Gaza Conflict</li>
            <li className="hover:text-red-500 cursor-pointer">Ukraine-Russia Conflict</li>
            <li className="hover:text-red-500 cursor-pointer">World’s 50 Best Restaurants</li>
            <li className="hover:text-red-500 cursor-pointer">SAG Awards 2025</li>
            <li className="hover:text-red-500 cursor-pointer">Sotheby’s Auction</li>
            <li className="hover:text-red-500 cursor-pointer">Super Bowl 2025</li>
          </ul>
        </div>
      </aside>

      {/* Main Chat Area */}

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Hello, Christina! I am ELMO! What can I help you learn about?
        </h1>

        {/* Prompt */}

        <div className="w-full max-w-xl flex justify-end mb-6">
          <button
            onClick={() => setInput("Who is Kamala Harris?")}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          >
            Who is Kamala Harris?
          </button>
        </div>

        {/* Message */}

        <div className="flex flex-col gap-4 w-full max-w-xl min-h-[200px] mb-10">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-md border w-fit max-w-full ${
                msg.sender === 'bot'
                  ? 'bg-white text-gray-800 self-start'
                  : 'bg-red-100 text-gray-900 self-end'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box */}

        <div className="flex items-center w-full max-w-xl border rounded-md px-4 py-2 mb-16">
          <input
            type="text"
            className="flex-1 outline-none text-sm"
            placeholder="Ask me anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="ml-2 text-gray-700 hover:text-black transition">
            <FaPaperPlane />
          </button>
        </div>

        {/* Recent Inquiries */}
        
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Recent Inquiries</h2>
          <ul className="space-y-4">
            {recentInquiries.map((question, i) => (
              <li
                key={i}
                className="border p-4 rounded-md hover:bg-gray-50 cursor-pointer transition"
              >
                <h3 className="text-md font-medium">{question}</h3>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
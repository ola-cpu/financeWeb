"use client";

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/ai/ChatInterface';

export default function CoachPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">AI Financial Coach</h1>
          <p className="text-gray-500 dark:text-gray-400">Consult with Arkad, the wisest man in Babylon.</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

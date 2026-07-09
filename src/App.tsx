import { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import MobileTabBar from './components/layout/MobileTabBar';
import CalendarView from './components/calendar/CalendarView';
import NewPostView from './components/post/NewPostView';
import TrendReport from './components/trends/TrendReport';
import DemoControls from './components/demo/DemoControls';
import type { ViewType } from './types';

function AppShell() {
  const [view, setView] = useState<ViewType>('calendar');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const content = {
    calendar: <CalendarView />,
    newpost: <NewPostView onSuccess={() => setView('calendar')} />,
    trends: <TrendReport />,
    demo: <DemoControls />,
  }[view];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* デスクトップサイドバー */}
      <div className="hidden md:flex h-full">
        <Sidebar currentView={view} onViewChange={setView} />
      </div>

      {/* モバイルサイドバー（オーバーレイ） */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-72 h-full bg-white shadow-2xl flex flex-col">
            <Sidebar
              currentView={view}
              onViewChange={(v) => {
                setView(v);
                setMobileSidebarOpen(false);
              }}
            />
          </div>
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* モバイルヘッダー */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md shadow-pink-200">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">RecruitGram</span>
          </div>
        </header>

        {/* スクロール可能なコンテンツエリア */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 md:p-6 pb-24 md:pb-8">
            {content}
          </div>
        </main>
      </div>

      {/* モバイル下部タブバー */}
      <MobileTabBar currentView={view} onViewChange={setView} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

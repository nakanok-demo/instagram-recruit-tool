import { CalendarDays, Sparkles, TrendingUp, Settings2 } from 'lucide-react';
import type { ViewType } from '../../types';
import { useApp } from '../../context/AppContext';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

const NAV_ITEMS: { id: ViewType; icon: React.ElementType; label: string }[] = [
  { id: 'calendar', icon: CalendarDays, label: 'カレンダー' },
  { id: 'newpost', icon: Sparkles, label: '新規AI投稿' },
  { id: 'trends', icon: TrendingUp, label: 'トレンドレポート' },
];

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (v: ViewType) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { state } = useApp();
  const mockDate = parseISO(state.mockCurrentDate);

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col">
      {/* ロゴ */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md shadow-pink-200">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-base leading-tight">RecruitGram</div>
            <div className="text-xs text-slate-400">採用投稿自動化ツール</div>
          </div>
        </div>
      </div>

      {/* メインナビ */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-200'
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* デモコントロール */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => onViewChange('demo')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            currentView === 'demo'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-200'
              : 'text-slate-500 hover:bg-gray-50 hover:text-slate-700'
          }`}
        >
          <Settings2 size={18} />
          <div className="text-left">
            <div className="leading-tight">デモコントロール</div>
            <div className="text-xs opacity-70 mt-0.5">
              {format(mockDate, 'M/d (E)', { locale: ja })}
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}

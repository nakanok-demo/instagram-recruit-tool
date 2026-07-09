import { CalendarDays, Sparkles, TrendingUp, Settings2 } from 'lucide-react';
import type { ViewType } from '../../types';

const TABS: { id: ViewType; icon: React.ElementType; label: string }[] = [
  { id: 'calendar', icon: CalendarDays, label: 'カレンダー' },
  { id: 'newpost', icon: Sparkles, label: '新規投稿' },
  { id: 'trends', icon: TrendingUp, label: 'トレンド' },
  { id: 'demo', icon: Settings2, label: 'デモ' },
];

interface MobileTabBarProps {
  currentView: ViewType;
  onViewChange: (v: ViewType) => void;
}

export default function MobileTabBar({ currentView, onViewChange }: MobileTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {TABS.map(({ id, icon: Icon, label }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                active ? 'text-pink-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-b-full" />
              )}
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

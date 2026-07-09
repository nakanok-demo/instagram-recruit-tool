import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DummyImage from '../common/DummyImage';
import StatusBadge from '../common/StatusBadge';
import type { RecruitPost } from '../../types';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function PostCard({ post }: { post: RecruitPost }) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
      <div className="w-8 h-8 rounded-md overflow-hidden shrink-0">
        <DummyImage imageIndex={post.imageIndex} className="w-full h-full" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold text-slate-700 truncate leading-tight">
          {post.theme}
        </div>
        <StatusBadge status={post.status} size="sm" />
      </div>
    </div>
  );
}

export default function CalendarView() {
  const { state } = useApp();
  const mockDate = parseISO(state.mockCurrentDate);
  const [displayMonth, setDisplayMonth] = useState(startOfMonth(mockDate));

  const monthStart = startOfMonth(displayMonth);
  const monthEnd = endOfMonth(displayMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const postsForDay = (day: Date) =>
    state.posts.filter((p) => isSameDay(parseISO(p.scheduledAt), day));

  const scheduledCount = state.posts.filter((p) => p.status === 'scheduled').length;
  const postedCount = state.posts.filter((p) => p.status === 'posted').length;

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays size={24} className="text-pink-500" />
            投稿カレンダー
          </h1>
          <div className="flex gap-4 mt-1.5">
            <span className="text-sm text-slate-500">
              予約中{' '}
              <span className="font-bold text-amber-600">{scheduledCount}</span> 件
            </span>
            <span className="text-sm text-slate-500">
              投稿済{' '}
              <span className="font-bold text-emerald-600">{postedCount}</span> 件
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setDisplayMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-slate-700 w-28 text-center">
            {format(displayMonth, 'yyyy年 M月', { locale: ja })}
          </span>
          <button
            onClick={() => setDisplayMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/60">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={wd}
              className={`py-2.5 text-center text-xs font-bold ${
                i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* 日付セル */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
          {days.map((day, idx) => {
            const posts = postsForDay(day);
            const inMonth = isSameMonth(day, displayMonth);
            const isToday = isSameDay(day, mockDate);
            const dow = day.getDay();

            return (
              <div
                key={idx}
                className={`min-h-[90px] md:min-h-[110px] p-1.5 ${
                  !inMonth ? 'bg-gray-50/40' : ''
                }`}
              >
                <div className="mb-1">
                  <span
                    className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold ${
                      isToday
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
                        : !inMonth
                        ? 'text-slate-300'
                        : dow === 0
                        ? 'text-rose-400'
                        : dow === 6
                        ? 'text-blue-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {posts.slice(0, 2).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {posts.length > 2 && (
                    <p className="text-[10px] text-slate-400 pl-1">+{posts.length - 2} 件</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

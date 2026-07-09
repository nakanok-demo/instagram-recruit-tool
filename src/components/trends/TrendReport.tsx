import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Lightbulb, RefreshCw, Flame, CalendarClock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchTrendReport, type TrendData } from '../../services/apiMock';
import { format, parseISO, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function TrendReport() {
  const { state } = useApp();
  const { trendReport } = state;
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTrendReport(trendReport.patternIndex).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [trendReport.patternIndex]);

  const generatedDate = parseISO(trendReport.generatedAt);
  const nextUpdateDate = addDays(generatedDate, 14);

  if (loading || !data) {
    return (
      <div className="space-y-5">
        <PageHeader />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-4">
          <RefreshCw size={32} className="text-purple-400 animate-spin" />
          <p className="text-sm text-slate-500">レポートを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={24} className="text-pink-500" />
            トレンドレポート
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">2週間ごとに更新される採用投稿の最新トレンド</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-slate-400">最終更新</div>
          <div className="text-sm font-semibold text-slate-700">
            {format(generatedDate, 'M月d日 (E)', { locale: ja })}
          </div>
        </div>
      </div>

      {/* レポートタイトルカード */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-pink-200">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={18} className="text-white/80" />
          <span className="text-sm font-semibold text-white/80">{data.title}</span>
        </div>
        <p className="text-lg font-bold leading-snug">{data.description}</p>
        <div className="mt-3 flex items-center gap-2 text-white/70 text-xs">
          <CalendarClock size={13} />
          次回更新予定: {format(nextUpdateDate, 'M月d日 (E)', { locale: ja })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* トレンドランキング */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <TrendingUp size={16} className="text-pink-500" />
            コンテンツトレンド
          </h2>
          <div className="space-y-2.5">
            {data.trends.map((item, i) => {
              const isUp = item.growth.startsWith('+');
              return (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                    {item.hot && (
                      <Flame size={12} className="text-orange-400 shrink-0" />
                    )}
                    <span className="text-sm text-slate-700 truncate">{item.label}</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-bold shrink-0 ${
                      isUp ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {item.growth}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 最適投稿時間 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Clock size={16} className="text-purple-500" />
            最適な投稿時間
          </h2>
          <div className="space-y-3">
            {data.bestTimes.map((bt, i) => (
              <div key={i} className="rounded-xl bg-purple-50 border border-purple-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-purple-700">{bt.day}</span>
                  <span className="text-sm font-bold text-purple-900">{bt.time}</span>
                </div>
                <p className="text-xs text-purple-600">{bt.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* コンテンツヒント */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500" />
          AIへのフィードバック反映済みヒント
        </h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {data.contentHints.map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100"
            >
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 leading-relaxed">{hint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <TrendingUp size={24} className="text-pink-500" />
        トレンドレポート
      </h1>
    </div>
  );
}

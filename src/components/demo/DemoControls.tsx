import { FastForward, RefreshCw, CalendarDays, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function DemoControls() {
  const { state, dispatch } = useApp();
  const mockDate = parseISO(state.mockCurrentDate);

  const scheduledCount = state.posts.filter((p) => p.status === 'scheduled').length;
  const postedCount = state.posts.filter((p) => p.status === 'posted').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          デモコントロール
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          モック動作のシミュレーション操作パネル
        </p>
      </div>

      {/* 現在のモック日時 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shrink-0">
            <CalendarDays size={22} className="text-purple-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
              現在のモック日時
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {format(mockDate, 'yyyy年 M月d日 (E)', { locale: ja })}
            </div>
          </div>
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 1日進める */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <FastForward size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 leading-tight">デモ時間を1日進める</div>
              <div className="text-xs text-slate-500 mt-0.5">
                予約日時を過ぎた投稿のステータスが
                <br />「予約中」→「投稿済」に自動で切り替わります
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'ADVANCE_DAY' })}
            className="w-full py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold text-sm active:scale-95 transition-all"
          >
            1日進める →
          </button>
        </div>

        {/* トレンド更新 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <RefreshCw size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 leading-tight">トレンドを更新する</div>
              <div className="text-xs text-slate-500 mt-0.5">
                「2週間が経過した」と見なし、トレンド
                <br />レポートと次のAI生成の傾向が切り替わります
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'UPDATE_TRENDS' })}
            className="w-full py-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-sm active:scale-95 transition-all"
          >
            トレンドを更新 ↻
          </button>
        </div>
      </div>

      {/* 現在の統計 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2 mb-4">
          <Package size={15} className="text-slate-400" />
          現在の状態
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="py-3 rounded-xl bg-gray-50">
            <div className="text-2xl font-bold text-pink-600">{state.posts.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">総投稿数</div>
          </div>
          <div className="py-3 rounded-xl bg-amber-50">
            <div className="text-2xl font-bold text-amber-600">{scheduledCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">予約中</div>
          </div>
          <div className="py-3 rounded-xl bg-emerald-50">
            <div className="text-2xl font-bold text-emerald-600">{postedCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">投稿済</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-slate-400">
          <span>トレンドパターン: #{state.trendReport.patternIndex + 1}</span>
          <span>localStorage に自動保存中</span>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, type KeyboardEvent } from 'react';
import {
  Sparkles,
  RefreshCw,
  CalendarDays,
  Clock,
  CheckCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateAIPost, submitToInstagram, type GeneratedPostData } from '../../services/apiMock';
import DummyImage from '../common/DummyImage';
import { format, parseISO } from 'date-fns';

type FlowState = 'idle' | 'generating' | 'preview' | 'scheduling' | 'done';

interface NewPostViewProps {
  onSuccess?: () => void;
}

export default function NewPostView({ onSuccess }: NewPostViewProps) {
  const { state, dispatch } = useApp();
  const [flow, setFlow] = useState<FlowState>('idle');
  const [generated, setGenerated] = useState<GeneratedPostData | null>(null);
  const [caption, setCaption] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [dateError, setDateError] = useState('');
  const composing = useRef(false);

  const handleGenerate = async () => {
    setFlow('generating');
    setDateError('');
    try {
      const result = await generateAIPost(state.trendReport.patternIndex);
      setGenerated(result);
      setCaption(result.caption);
      const tomorrow = new Date(parseISO(state.mockCurrentDate));
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(format(tomorrow, 'yyyy-MM-dd'));
      setScheduleTime('12:00');
      setFlow('preview');
    } catch {
      setFlow('idle');
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      setDateError('日付を選択してください');
      return;
    }
    if (!generated) return;
    setFlow('scheduling');
    try {
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();
      await submitToInstagram({ imageIndex: generated.imageIndex, caption, scheduledAt });
      dispatch({
        type: 'ADD_POST',
        post: {
          id: `post_${Date.now()}`,
          imageIndex: generated.imageIndex,
          caption,
          scheduledAt,
          status: 'scheduled',
          createdAt: state.mockCurrentDate,
          theme: generated.theme,
        },
      });
      setFlow('done');
    } catch {
      setFlow('preview');
    }
  };

  const handleReset = () => {
    setFlow('idle');
    setGenerated(null);
    setCaption('');
    setDateError('');
  };

  // IME確定のEnterキーでフォームが誤送信しないよう制御
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && composing.current) {
      e.stopPropagation();
    }
  };

  // ===== IDLE =====
  if (flow === 'idle') {
    return (
      <div className="space-y-5">
        <PageHeader
          title="新規AI投稿"
          subtitle="AIが採用向けのInstagram投稿を自動で生成します"
        />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <Sparkles size={36} className="text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">投稿をAIで自動生成</h2>
            <p className="text-sm text-slate-500 max-w-sm">
              現在のトレンドレポートをもとに、採用向けのキャプションと画像テーマを提案します
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 active:scale-95 transition-all text-base"
          >
            <Sparkles size={20} />
            AIで投稿を自動生成
          </button>
          <p className="text-xs text-slate-400">
            適用中のトレンドパターン: #{state.trendReport.patternIndex + 1}
          </p>
        </div>
      </div>
    );
  }

  // ===== GENERATING =====
  if (flow === 'generating') {
    return (
      <div className="space-y-5">
        <PageHeader title="新規AI投稿" subtitle="AIが採用向けのInstagram投稿を自動で生成します" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 flex flex-col items-center text-center gap-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 opacity-20 animate-ping" />
            <Loader2 size={40} className="text-purple-500 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">AIが投稿を考えています...</h2>
            <p className="text-sm text-slate-500">トレンドを分析して最適な投稿を生成中です</p>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 animate-bounce"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== DONE =====
  if (flow === 'done') {
    return (
      <div className="space-y-5">
        <PageHeader title="新規AI投稿" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle size={44} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">予約完了！</h2>
            <p className="text-sm text-slate-500">投稿がスケジュールに追加されました</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <Sparkles size={16} />
              また生成する
            </button>
            {onSuccess && (
              <button
                onClick={onSuccess}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
              >
                カレンダーを見る
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== PREVIEW / SCHEDULING =====
  const isScheduling = flow === 'scheduling';
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title="投稿プレビュー"
          subtitle="内容を確認・編集して予約してください"
        />
        <button
          onClick={handleGenerate}
          disabled={isScheduling}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 mt-1"
        >
          <RefreshCw size={14} />
          別の案を生成
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* 画像プレビュー */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-600">画像プレビュー</h3>
          <div className="aspect-square rounded-xl overflow-hidden">
            {generated && <DummyImage imageIndex={generated.imageIndex} className="w-full h-full" />}
          </div>
          <p className="text-xs text-slate-400 text-center">
            ※ 本番時は生成AIで画像を自動生成します
          </p>
        </div>

        {/* キャプション + スケジュール */}
        <div className="space-y-4">
          {/* キャプション */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-600">キャプション</h3>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onCompositionStart={() => { composing.current = true; }}
              onCompositionEnd={() => { composing.current = false; }}
              onKeyDown={handleKeyDown}
              rows={9}
              disabled={isScheduling}
              className="w-full text-sm text-slate-700 border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent disabled:bg-gray-50 disabled:text-slate-400 transition-shadow leading-relaxed"
              placeholder="キャプションを入力..."
            />
          </div>

          {/* スケジュール */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-600">投稿スケジュール</h3>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
                <CalendarDays size={12} />
                日付
              </label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => { setScheduleDate(e.target.value); setDateError(''); }}
                onCompositionStart={() => { composing.current = true; }}
                onCompositionEnd={() => { composing.current = false; }}
                onKeyDown={handleKeyDown}
                disabled={isScheduling}
                className={`w-full text-sm border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent disabled:bg-gray-50 transition-shadow ${
                  dateError ? 'border-rose-400 bg-rose-50' : 'border-gray-200'
                }`}
              />
              {dateError && <p className="text-xs text-rose-500 mt-1">{dateError}</p>}
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
                <Clock size={12} />
                時刻
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                disabled={isScheduling}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent disabled:bg-gray-50 transition-shadow"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3">
            <button
              onClick={handleSchedule}
              disabled={isScheduling}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isScheduling ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  予約中...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  これでOK（予約）
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={isScheduling}
              className="px-5 py-3.5 border border-gray-200 text-slate-600 font-medium rounded-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
            >
              やり直し
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

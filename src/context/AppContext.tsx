import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction } from '../types';
import { loadState, saveState } from '../utils/storage';
import { addDays, parseISO, isAfter } from 'date-fns';

const initialState: AppState = {
  posts: [],
  trendReport: {
    generatedAt: new Date().toISOString(),
    patternIndex: 0,
  },
  mockCurrentDate: new Date().toISOString(),
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.state;

    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.post] };

    case 'ADVANCE_DAY': {
      const nextDate = addDays(parseISO(state.mockCurrentDate), 1);
      const updatedPosts = state.posts.map((post) => {
        if (
          post.status === 'scheduled' &&
          !isAfter(parseISO(post.scheduledAt), nextDate)
        ) {
          return { ...post, status: 'posted' as const };
        }
        return post;
      });
      return { ...state, mockCurrentDate: nextDate.toISOString(), posts: updatedPosts };
    }

    case 'UPDATE_TRENDS':
      return {
        ...state,
        trendReport: {
          generatedAt: state.mockCurrentDate,
          patternIndex: (state.trendReport.patternIndex + 1) % 3,
        },
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: 'LOAD_STATE', state: saved });
  }, []);

  // 状態変更のたびに保存
  useEffect(() => {
    saveState(state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

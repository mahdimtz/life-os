const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ── Tasks ──
export const tasksApi = {
  list: (date?: string) => request<{ tasks: any[] }>(`/tasks${date ? `?date=${date}` : ''}`),
  create: (data: { title: string; priority: string; estimatedMinutes: number; category?: string; date?: string; goalId?: string }) =>
    request<{ task: any }>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  toggle: (id: string) => request<{ task: any }>(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  remove: (id: string) => request<{ success: boolean }>(`/tasks/${id}`, { method: 'DELETE' }),
};

// ── Goals ──
export const goalsApi = {
  list: () => request<{ goals: any[] }>('/goals'),
  create: (data: { title: string; description: string; timeframe: string; deadline: string }) =>
    request<{ goal: any }>('/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateProgress: (id: string, progress: number) =>
    request<{ goal: any }>(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify({ progress }) }),
  remove: (id: string) => request<{ success: boolean }>(`/goals/${id}`, { method: 'DELETE' }),
};

// ── Learning ──
export const learningApi = {
  list: () => request<{ entries: any[] }>('/learning'),
  create: (data: { category: string; title: string; hours: number; notes?: string; date?: string }) =>
    request<{ entry: any }>('/learning', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: string) => request<{ success: boolean }>(`/learning/${id}`, { method: 'DELETE' }),
};

// ── Journal ──
export const journalApi = {
  list: () => request<{ entries: any[] }>('/journal'),
  create: (data: { mood: string; energy: string; notes: string; lessons: string; gratitude: string }) =>
    request<{ entry: any }>('/journal', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, string>) =>
    request<{ entry: any }>(`/journal/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Stats ──
export const statsApi = {
  list: () => request<{ stats: any[] }>('/stats'),
  upsert: (data: any) => request<{ stat: any }>('/stats', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Identity ──
export const identityApi = {
  list: () => request<{ votes: any[] }>('/identity'),
  create: (data: { action: string; category: string }) =>
    request<{ vote: any }>('/identity', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Settings ──
export const settingsApi = {
  get: () => request<{ settings: any }>('/settings'),
  update: (data: Record<string, any>) =>
    request<{ settings: any }>('/settings', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Gym ──
export const gymApi = {
  toggle: (date?: string) => request<{ stat: any }>('/gym/toggle', { method: 'POST', body: JSON.stringify({ date }) }),
};

// ── Data ──
export const dataApi = {
  exportAll: () => request<any>('/data/export'),
  reset: () => request<{ success: boolean }>('/data/reset', { method: 'DELETE' }),
  seed: () => request<{ success: boolean }>('/data/seed', { method: 'POST' }),
};

// ── Auth ──
export const authApi = {
  login: (password: string) =>
    request<{ success: boolean; isFirstTime: boolean }>('/auth', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  logout: () => request<{ success: boolean }>('/auth', { method: 'DELETE' }),
  check: () => request<{ authenticated: boolean }>('/auth'),
};

import { toast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'http://localhost:5000/api';

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string;
}

const api = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
    throw error;
  }
};

// Auth API
export const authApi = {
  register: (userData: any) => api('/auth/register', { method: 'POST', body: userData }),
  login: (credentials: any) => api('/auth/login', { method: 'POST', body: credentials }),
  getProfile: (token: string) => api('/auth/me', { token }),
  resetPassword: (email: string) => api('/auth/reset-password', { method: 'POST', body: { email } }),
  changePassword: (passwordData: { currentPassword: string; newPassword: string }, token: string) => 
    api('/auth/change-password', { method: 'POST', body: passwordData, token }),
  githubAuth: () => api('/auth/github'),
  googleAuth: () => api('/auth/google')
};

// Quiz API
export const quizApi = {
  getAll: () => api('/quiz'),
  getById: (id: string) => api(`/quiz/${id}`),
  create: (quizData: any, token: string) => api('/quiz', { method: 'POST', body: quizData, token }),
  update: (id: string, quizData: any, token: string) => api(`/quiz/${id}`, { method: 'PUT', body: quizData, token }),
  delete: (id: string, token: string) => api(`/quiz/${id}`, { method: 'DELETE', token }),
};

// User API
export const userApi = {
  getProfile: (id: string) => api(`/user/profile/${id}`),
  updateProfile: (userData: any, token: string) => api('/user/profile', { method: 'PUT', body: userData, token }),
  updateStats: (statsData: any, token: string) => api('/user/stats', { method: 'PUT', body: statsData, token }),
  getLeaderboard: () => api('/user/leaderboard'),
};

// Tournament API
export const tournamentApi = {
  getAll: async (includePrivate = false) => {
    const response = await fetch(`${API_BASE_URL}/tournament?includePrivate=${includePrivate}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tournaments');
    }
    return await response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tournament/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tournament');
    }
    return await response.json();
  },
  
  create: async (tournamentData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/tournament`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tournamentData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create tournament');
    }
    
    return await response.json();
  },
  
  join: async (tournamentId: string, accessCode: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/tournament/${tournamentId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ accessCode })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join tournament');
    }
    
    return await response.json();
  },
  
  start: async (tournamentId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/tournament/${tournamentId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start tournament');
    }
    
    return await response.json();
  },
  
  leave: async (tournamentId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/tournament/${tournamentId}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to leave tournament');
    }
    
    return await response.json();
  },
  
  delete: async (tournamentId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/tournament/${tournamentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete tournament');
    }
    
    return await response.json();
  }
};

export default api;
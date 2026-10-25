/**
 * CAMPUS CONNECT 2030 — UNIFIED REST API CLIENT
 * Handles authentication, user sessions, campus modules, and server communication.
 */

const CampusAPI = (function () {
  'use strict';

  const BASE_URL = '';

  // Local storage cache key for student identity session state
  const SESSION_KEY = 'campus_connect_user_session';

  async function request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || data?.error || `HTTP error ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      console.warn(`[API Request Error] ${endpoint}:`, err);
      throw err;
    }
  }

  return {
    // Auth endpoints
    async register(userData) {
      const result = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (result && result.student) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(result.student));
      }
      return result;
    },

    async login(email, password) {
      const result = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (result && result.student) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(result.student));
      }
      return result;
    },

    async logout() {
      try {
        await request('/api/auth/logout', { method: 'POST' });
      } catch (e) {
        // Ignore network errors during logout
      }
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    },

    async getCurrentUser() {
      try {
        const user = await request('/api/users/me');
        if (user) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(user));
          return user;
        }
      } catch (err) {
        // Check local cache if server is offline or not authenticated yet
        const cached = localStorage.getItem(SESSION_KEY);
        if (cached) {
          try { return JSON.parse(cached); } catch (e) {}
        }
      }
      return null;
    },

    getLocalUser() {
      const cached = localStorage.getItem(SESSION_KEY);
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
      return null;
    },

    setLocalUser(user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    },

    // Events endpoints
    async getEvents() {
      return await request('/api/events');
    },

    async registerEvent(eventId) {
      return await request(`/api/events/${eventId}/register`, {
        method: 'POST'
      });
    },

    // Communities / Clubs endpoints
    async getClubs() {
      return await request('/api/clubs');
    },

    async joinClub(clubId, reason = '') {
      return await request(`/api/clubs/${clubId}/join`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    },

    // Academic Resources endpoints
    async getResources(department = '', semester = '') {
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (semester) params.append('semester', semester);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await request(`/api/resources${query}`);
    },

    // Lost & Found endpoints
    async getLostFoundItems(type = '') {
      const query = type ? `?type=${type}` : '';
      return await request(`/api/lost-found${query}`);
    },

    async reportLostFoundItem(itemData) {
      return await request('/api/lost-found', {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
    },

    // Announcements
    async getAnnouncements() {
      return await request('/api/announcements');
    },

    // Java Lab Modules
    async getJavaLabModules() {
      return await request('/api/javalab/modules');
    }
  };
})();

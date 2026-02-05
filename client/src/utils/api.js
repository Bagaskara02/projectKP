// API Helper Functions
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/simonev-pn2/api';

export const api = {
  // Main API
  get: async (endpoint, params = {}) => {
    const url = new URL(`${API_URL}/api.php`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const res = await fetch(url, { credentials: 'include' });
    return res.json();
  },

  post: async (endpoint, data, action = '') => {
    const url = action ? `${API_URL}/api.php?action=${action}` : `${API_URL}/api.php`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Auth API
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      return res.json();
    },

    logout: async () => {
      const res = await fetch(`${API_URL}/auth.php?action=logout`, {
        method: 'POST',
        credentials: 'include'
      });
      return res.json();
    },

    check: async () => {
      const res = await fetch(`${API_URL}/auth.php?action=check`, {
        credentials: 'include'
      });
      return res.json();
    }
  },

  // Audit API
  audit: {
    getLogs: async (params = {}) => {
      const url = new URL(`${API_URL}/audit.php`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      const res = await fetch(url, { credentials: 'include' });
      return res.json();
    }
  },

  // Backup API
  backup: {
    create: async () => {
      const res = await fetch(`${API_URL}/backup.php?action=backup`, {
        method: 'POST',
        credentials: 'include'
      });
      return res.json();
    },

    list: async () => {
      const res = await fetch(`${API_URL}/backup.php?action=list`, {
        credentials: 'include'
      });
      return res.json();
    },

    restore: async (file) => {
      const formData = new FormData();
      formData.append('backup_file', file);
      const res = await fetch(`${API_URL}/backup.php?action=restore`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      return res.json();
    }
  },

  // Upload API
  upload: {
    uploadFile: async (file, relatedTable = '', relatedId = 0) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('related_table', relatedTable);
      formData.append('related_id', relatedId);
      const res = await fetch(`${API_URL}/upload.php?action=upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      return res.json();
    },

    getFiles: async (table, id) => {
      const res = await fetch(`${API_URL}/upload.php?action=list&table=${table}&id=${id}`, {
        credentials: 'include'
      });
      return res.json();
    }
  },

  // Import API
  import: {
    importFile: async (file, indikatorId, tahun) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('indikator_id', indikatorId);
      formData.append('tahun', tahun);
      const res = await fetch(`${API_URL}/import.php?action=import`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      return res.json();
    },

    getTemplate: async (indikatorId) => {
      const res = await fetch(`${API_URL}/import.php?action=template&indikator_id=${indikatorId}`, {
        credentials: 'include'
      });
      return res.json();
    }
  },

  // Years
  getYears: async () => {
    const res = await fetch(`${API_URL}/api.php?action=years`, {
      credentials: 'include'
    });
    return res.json();
  }
};

export default api;

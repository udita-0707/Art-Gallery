const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

// ── Artworks ──────────────────────────────────────────────────────────────────
export const getArtworks = async () => {
  const response = await fetch(`${API_URL}/artworks`);
  if (!response.ok) throw new Error('Failed to fetch artworks');
  return response.json();
};

export const getArtworkById = async (id: string) => {
  const response = await fetch(`${API_URL}/artworks/${id}`);
  if (!response.ok) throw new Error('Failed to fetch artwork');
  return response.json();
};

export const createArtwork = async ({
  data,
  token,
}: {
  data: Record<string, any>;
  token: string;
}) => {
  const response = await fetch(`${API_URL}/artworks`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create artwork');
  }
  return response.json();
};

export const updateArtwork = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: Record<string, any>;
  token: string;
}) => {
  const response = await fetch(`${API_URL}/artworks/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update artwork');
  }
  return response.json();
};

export const deleteArtwork = async ({ id, token }: { id: string; token: string }) => {
  const response = await fetch(`${API_URL}/artworks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete artwork');
  return response.json();
};

export const moderateArtwork = async ({ id, token }: { id: string; token: string }) => {
  const response = await fetch(`${API_URL}/admin/artworks/${id}/moderate`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to moderate artwork');
  return response.json();
};

// ── Artists ───────────────────────────────────────────────────────────────────
export const getArtists = async () => {
  const response = await fetch(`${API_URL}/users/artists`);
  if (!response.ok) throw new Error('Failed to fetch artists');
  return response.json();
};

export const verifyArtist = async ({ id, token }: { id: string; token: string }) => {
  const response = await fetch(`${API_URL}/admin/artists/${id}/verify`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to verify artist');
  return response.json();
};

export const updateArtist = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: { bio?: string };
  token: string;
}) => {
  const response = await fetch(`${API_URL}/admin/artists/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update artist');
  return response.json();
};

export const deleteArtist = async ({ id, token }: { id: string; token: string }) => {
  const response = await fetch(`${API_URL}/admin/artists/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete artist');
  return response.json();
};

// ── Exhibitions ───────────────────────────────────────────────────────────────
export const getExhibitions = async () => {
  const response = await fetch(`${API_URL}/exhibitions`);
  if (!response.ok) throw new Error('Failed to fetch exhibitions');
  return response.json();
};

export const createExhibition = async ({
  data,
  token,
}: {
  data: Record<string, any>;
  token: string;
}) => {
  const response = await fetch(`${API_URL}/exhibitions`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create exhibition');
  }
  return response.json();
};

export const updateExhibition = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: Record<string, any>;
  token: string;
}) => {
  const response = await fetch(`${API_URL}/exhibitions/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update exhibition');
  return response.json();
};

export const deleteExhibition = async ({ id, token }: { id: string; token: string }) => {
  const response = await fetch(`${API_URL}/exhibitions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete exhibition');
  return response.json();
};

// ── Admin Stats ───────────────────────────────────────────────────────────────
export const getAdminStats = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to fetch admin stats');
  return response.json();
};

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/artworks/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};


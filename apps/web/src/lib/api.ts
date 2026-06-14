const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const getArtists = async () => {
  const response = await fetch(`${API_URL}/users/artists`);
  if (!response.ok) throw new Error('Failed to fetch artists');
  return response.json();
};

export const getFavorites = async (token?: string) => {
  if (!token) return [];
  const response = await fetch(`${API_URL}/users/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch favorites');
  return response.json();
};

export const toggleFavorite = async ({ artworkId, token }: { artworkId: string; token: string }) => {
  const response = await fetch(`${API_URL}/users/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ artworkId })
  });
  if (!response.ok) throw new Error('Failed to toggle favorite');
  return response.json();
};

export const getExhibitions = async () => {
  const response = await fetch(`${API_URL}/exhibitions`);
  if (!response.ok) throw new Error('Failed to fetch exhibitions');
  return response.json();
};


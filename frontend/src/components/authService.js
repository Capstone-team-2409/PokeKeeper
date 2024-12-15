import axios from 'axios';

const API_URL = 'https://pokekeeper.onrender.com';

export async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}

export default {
  refreshToken,
};

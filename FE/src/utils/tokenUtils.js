/**
 * Decode JWT token tanpa verifikasi signature (hanya untuk read payload di client)
 */
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check apakah token sudah expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) {
    return true; // Token invalid, anggap expired
  }

  // exp dalam seconds, ubah ke milliseconds
  const expireTime = decoded.exp * 1000;
  const now = Date.now();
  
  return now > expireTime;
};

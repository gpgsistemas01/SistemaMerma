export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { sameSite: 'lax', secure: true });
  res.clearCookie('refreshToken', { sameSite: 'lax', secure: true });
}
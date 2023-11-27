export function useSSRAuth({ req, res, next }) {
  let token = req.cookies._AUTH
  console.log('[SSR]token from client:', token)

  async function refreshToken() {
    const newToken = {
      accessToken: 'access-token:' + Date.now(),
      refreshToken: 'refresh-token:' + Date.now(),
      fromServer: true,
    }
    res.cookie('_AUTH', JSON.stringify(newToken), { maxAge: 900000, path: '/' })
    token = newToken
  }

  return {
    token,
    refreshToken,
  }
}

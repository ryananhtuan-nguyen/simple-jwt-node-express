- This is an example of a simplest authentication with jwt.
- General ideas are:
  + Login, generate access token & refresh token
  + use refresh token to renew access token
  + remove refresh token on logout
  + jwt verify when making requests.
  + expirations of tokens
  + separate auth server & main server => microservices/lots of authentication/authorization.

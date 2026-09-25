// ASSUMPTION (no auth provider specified): the external backend issues
// short-lived access tokens plus refresh tokens. Access tokens are kept in
// memory only (safer than localStorage against XSS); refresh tokens may be
// stored in an httpOnly cookie by the backend and are only swapped here.
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface Session {
  user: User;
  accessToken: string;
}

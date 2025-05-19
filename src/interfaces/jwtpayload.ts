export interface JwtPayload {
  valid?: string;
  email: string;
  id: string;
  role?: string;
}

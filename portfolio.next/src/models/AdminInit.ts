/**
 * Request to initialize the first admin user
 */
export interface AdminInitRequest {
  username: string;
  password: string;
  isAdmin: boolean;
}

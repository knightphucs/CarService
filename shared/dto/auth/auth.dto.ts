export interface LoginDto {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterDto {
  username: string;
  password: string;
  role?: 'Admin' | 'User';
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role?: 'Admin' | 'User';
    remember_me?: boolean;
  };
}

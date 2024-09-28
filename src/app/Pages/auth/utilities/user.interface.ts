export interface User {
  username: string;
  email: string;
  phone?: string;
  address?: string;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
  image?: File | null;
}

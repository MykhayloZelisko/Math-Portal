export interface UserInterface {
  id?: number;
  email: string;
  password: string;
  newPassword?: string | null;
  firstName: string;
  lastName: string;
  fullName?: string;
  isAdmin: boolean;
  photo: string | null;
}

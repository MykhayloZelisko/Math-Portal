export interface UserInterface {
  id?: string;
  email: string;
  password: string;
  newPassword?: string | null;
  firstName: string;
  lastName: string;
  fullName?: string;
  isAdmin: boolean;
  photo: string | null;
}

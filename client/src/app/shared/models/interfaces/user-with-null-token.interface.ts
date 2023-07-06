import { UserInterface } from './user.interface';
import { TokenInterface } from './token.interface';

export interface UserWithNullTokenInterface {
  user: UserInterface;
  token: TokenInterface | null;
}

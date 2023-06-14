import { UserInterface } from './user.interface';
import { TokenInterface } from './token.interface';

export interface UserWithTokenInterface {
  user: UserInterface;
  token: TokenInterface;
}

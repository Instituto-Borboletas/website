import { User, UserType } from '../User';
import { generateId } from '../../utils';

export class UserBuilder {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  userType: UserType;
  createdAt: number
  updatedAt: number

  constructor({ name, email, passwordHash, userType }: { name: string, email: string, passwordHash: string, userType: UserType }) {
    this.id = generateId();
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.userType = userType;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  setId(id: string) {
    this.id = id;
    return this;
  }

  setCreatedAt(createdAt: number) {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: number) {
    this.updatedAt = updatedAt;
    return this;
  }

  build() {
    return new User(this);
  }

  static fromDB (userFromDB: Record<string, string>) {
    return new User({
      id: userFromDB.id,
      userType: userFromDB.user_type as UserType,
      email: userFromDB.email,
      name: userFromDB.name,
      passwordHash: userFromDB.password_hash,
      createdAt: Number(userFromDB.created_at),
      updatedAt: Number(userFromDB.updated_at),
    })
  }
}

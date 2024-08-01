import { User, UserType } from '../User';
import { generateId } from '../../utils';

export class UserBuilder {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  userType: UserType;
  createtAt: number
  updatedAt: number

  constructor({ name, email, passwordHash, userType }: { name: string, email: string, passwordHash: string, userType: UserType }) {
    this.id = generateId();
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.userType = userType;
    this.createtAt = Date.now();
    this.updatedAt = Date.now();
  }

  setId(id: string) {
    this.id = id;
    return this;
  }

  setCreatedAt(createdAt: number) {
    this.createtAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: number) {
    this.updatedAt = updatedAt;
    return this;
  }

  build() {
    return new User(this);
  }
}

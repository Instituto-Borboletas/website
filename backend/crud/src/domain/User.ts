type UserType = "internal" | "external"

type UserEntityProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  user_type: UserType;
}

export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: UserType;
  createtAt: number
  updatedAt: number

  constructor({ id, name, email, password, user_type }: UserEntityProps) {
    this.id = id
    this.name = name;
    this.email = email;
    this.password = password;
    this.userType = user_type;
    this.createtAt = Date.now();
    this.updatedAt = Date.now();
  }
}

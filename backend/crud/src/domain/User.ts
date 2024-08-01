export type UserType = "internal" | "external"

type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  user_type: UserType;
}

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: UserType;
  createtAt: number
  updatedAt: number

  constructor({ id, name, email, password, user_type }: UserProps) {
    this.id = id
    this.name = name;
    this.email = email;
    this.password = password;
    this.userType = user_type;
    this.createtAt = Date.now();
    this.updatedAt = Date.now();
  }
}

type UserExtraDataProps = {
  id: string;
  userId: string;
  cpf: string;
  phone: string;
  birth_date: Date;
}

export class UserExtraData {
  id: string;
  userId: string;
  cpf: string;
  phone: string;
  birth_date: Date;
  createtAt: number
  updatedAt: number

  constructor({ id, userId, cpf, phone, birth_date }: UserExtraDataProps) {
    this.id = id
    this.userId = userId
    this.cpf = cpf;
    this.phone = phone;
    this.birth_date = birth_date;
    this.createtAt = Date.now();
    this.updatedAt = Date.now();
  }
}

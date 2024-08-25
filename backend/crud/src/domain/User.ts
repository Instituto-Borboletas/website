export type UserType = "internal" | "external"

type UserProps = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  userType: UserType;
}

export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  userType: UserType;
  createdAt: number
  updatedAt: number

  constructor({ id, name, email, passwordHash, userType }: UserProps) {
    this.id = id
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.userType = userType;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}

type UserExtraDataProps = {
  id: string;
  userId: string;
  cpf: string;
  cpfUf: string;
  phone: string;
  birth_date: Date;
}

export class UserExtraData {
  id: string;
  userId: string;
  cpf: string;
  cpfUf: string;
  phone: string;
  birth_date: Date;
  createdAt: number
  updatedAt: number

  constructor({ id, userId, cpf, cpfUf, phone, birth_date }: UserExtraDataProps) {
    this.id = id
    this.userId = userId
    this.cpf = cpf;
    this.cpfUf = cpfUf;
    this.phone = phone;
    this.birth_date = birth_date;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}

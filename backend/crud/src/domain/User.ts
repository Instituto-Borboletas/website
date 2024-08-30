export type UserType = "internal" | "external"

type UserProps = {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  userType: UserType;
  createdAt?: number
  updatedAt?: number
}

export class User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  userType: UserType;
  createdAt: number
  updatedAt: number

  constructor({ id, name, email, passwordHash, userType, createdAt, updatedAt }: UserProps) {
    this.id = id
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.userType = userType;
    this.createdAt = createdAt ?? Date.now();
    this.updatedAt = updatedAt ?? Date.now();
  }
}

type UserExtraDataProps = {
  id: string;
  userId: string;
  cpf: string;
  cpfUf: string;
  phone: string;
  trustedPhone: string;
  trustedName: string;
  housing: string;
  work: string;
  income: string;
  adultChildren: number;
  kidChildren: number;
  birthDate: Date;
  addressId: string;
  createdAt: number;
}

export class UserExtraData {
  id: string;
  userId: string;
  cpf: string;
  cpfUf: string;
  phone: string;
  trustedPhone: string;
  trustedName: string;
  housing: string;
  work: string;
  income: string;
  adultChildren: number;
  kidChildren: number;
  birthDate: Date;
  addressId: string;
  createdAt: number;

  constructor({
    id,
    userId,
    cpf,
    cpfUf,
    phone,
    trustedPhone,
    trustedName,
    housing,
    work,
    income,
    adultChildren,
    kidChildren,
    birthDate,
    createdAt,
    addressId
  }: UserExtraDataProps) {
    this.id = id
    this.userId = userId
    this.cpf = cpf;
    this.cpfUf = cpfUf;
    this.phone = phone;
    this.trustedPhone = trustedPhone;
    this.trustedName = trustedName;
    this.housing = housing;
    this.work = work;
    this.income = income;
    this.adultChildren = adultChildren;
    this.kidChildren = kidChildren;
    this.birthDate = birthDate;
    this.createdAt = createdAt;
    this.addressId = addressId;
  }
}

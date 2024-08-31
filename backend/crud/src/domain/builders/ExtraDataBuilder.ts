import { UserExtraData } from "../User";

type ExtraDataBuilderProps = {
  id?: string;
  userId: string;
  cpf: string;
  cpfUf: string;
  phone: string;
  trustedPhone: string;
  trustedName: string;
  relation: string;
  housing: string;
  work: string;
  income: string;
  adultChildren: number;
  kidChildren: number;
  birthDate: Date;
  addressId: string;
  createdAt?: number;
}

export class ExtraDataBuilder {
  id?: string;
  userId: string;
  cpf: string;
  cpfUf: string;
  phone: string;
  trustedPhone: string;
  trustedName: string;
  housing: string;
  relation: string;
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
    relation,
    income,
    adultChildren,
    kidChildren,
    birthDate,
    createdAt,
    addressId
  }: ExtraDataBuilderProps) {
    this.id = id;
    this.userId = userId;
    this.cpf = cpf;
    this.cpfUf = cpfUf;
    this.phone = phone;
    this.trustedPhone = trustedPhone;
    this.trustedName = trustedName;
    this.housing = housing;
    this.work = work;
    this.relation = relation;
    this.income = income;
    this.adultChildren = adultChildren;
    this.kidChildren = kidChildren;
    this.birthDate = birthDate;
    this.addressId = addressId;
    this.createdAt = createdAt ?? Date.now();
  }

  setTrustedPhone(trustedPhone: string) {
    this.trustedPhone = trustedPhone;
    return this;
  }

  setTrustedName(trustedName: string) {
    this.trustedName = trustedName;
    return this;
  }

  setHousing(housing: string) {
    this.housing = housing;
    return this;
  }

  setWork(work: string) {
    this.work = work;
    return this;
  }

  setRelation(relation: string) {
    this.relation = relation;
    return this;
  }

  setIncome(income: string) {
    this.income = income;
    return this;
  }

  setAdultChildren(adultChildren: number) {
    this.adultChildren = adultChildren;
    return this;
  }

  setKidChildren(kidChildren: number) {
    this.kidChildren = kidChildren;
    return this;
  }

  setBirthDate(birthDate: Date) {
    this.birthDate = birthDate;
    return this;
  }

  setAddressId(addressId: string) {
    this.addressId = addressId;
    return this;
  }

  build() {
    return new UserExtraData(this)
  }

  static fromDB(data: Record<string, string>): UserExtraData {
    throw new Error('not implemented', data);
  }
}

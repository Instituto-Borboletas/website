import { generateId } from '../../utils';
import { Address } from '../Address';

type AddressBuilderProps = {
  id?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip?: string;
  createdBy?: string;
  createdAt?: number;
  description?: string;
  complement?: string;
  number?: number;
}
export class AddressBuilder {
  id: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  createdBy: string;
  createdAt: number;
  description: string | null;
  complement: string;
  number: number;

  constructor({ id, street, neighborhood, city, state, zip, createdBy, createdAt, description, number, complement }: AddressBuilderProps) {
    this.id = id ?? generateId();
    this.street = street ?? "";
    this.neighborhood = neighborhood ?? "";
    this.city = city ?? "";
    this.state = state ?? "";
    this.zip = zip ?? "";
    this.createdBy = createdBy ?? "";
    this.createdAt = createdAt ?? Date.now();
    this.description = description ?? null;
    this.complement = complement ?? "";
    this.number = number ?? 0;
  }

  setStreet(street: string) {
    this.street = street;
    return this;
  }

  setCreatedAt(createdAt: number) {
    this.createdAt = createdAt;
    return this;
  }

  setCreatedBy(createdBy: string) {
    this.createdBy = createdBy;
    return this;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  setComplement(comp: string) {
    this.complement = comp;
  }

  setNumber(num: number) {
    this.number = num;
  }

  build() {
    return new Address(this)
  }

  static fromDB (data: Record<string, string>): Address {
    throw new Error('not implemented')
  }
}

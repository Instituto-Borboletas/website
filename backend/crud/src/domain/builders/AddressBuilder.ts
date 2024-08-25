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

  constructor({ id, street, neighborhood, city, state, zip, createdBy, createdAt, description }: AddressBuilderProps) {
    this.id = id ?? generateId();
    this.street = street ?? "";
    this.neighborhood = neighborhood ?? "";
    this.city = city ?? "";
    this.state = state ?? "";
    this.zip = zip ?? "";
    this.createdBy = createdBy ?? "";
    this.createdAt = createdAt ?? Date.now();
    this.description = description ?? null;
  }

  setStreeet(street: string) {
    this.street = street;
    return this;
  }

  setCreatedAt(createdAt: number) {
    this.createdAt = createdAt;
    return this;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  build() {
    return new Address(this)
  }
}

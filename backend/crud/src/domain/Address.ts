type AddressProps = {
  id: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  createdBy: string;
  createdAt: number;
  description: string | null;
}

export class Address {
  id: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  createdBy: string;
  createdAt: number;
  description: string | null;

  constructor({
    id,
    street,
    neighborhood,
    city,
    state,
    zip,
    createdBy,
    createdAt,
    description
  }: AddressProps) {
    this.id = id;
    this.street = street;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.description = description ?? null;
  }
}

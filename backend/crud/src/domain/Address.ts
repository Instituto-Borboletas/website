type AddressProps = {
  id: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  createdBy: string;
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

  constructor({ id, street, neighborhood, city, state, zip, createdBy }: AddressProps) {
    this.id = id;
    this.street = street;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.createdBy = createdBy;
    this.createdAt = Date.now();
  }
}

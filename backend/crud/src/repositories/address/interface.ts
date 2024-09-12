import { Address } from '../../domain/Address';

export interface AddressRepository {
  save(data: Address): Promise<void>
  get(id: string): Promise<Address | null>
}

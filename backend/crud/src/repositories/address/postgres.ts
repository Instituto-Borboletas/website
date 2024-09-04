import knex from 'knex';
import pino from 'pino';
import { Address } from '../../domain/Address';
import { AddressRepository } from './interface';
import { AddressBuilder } from '../../domain/builders/AddressBuilder';

export class PostgresAddressRepository implements AddressRepository {
  private tableName = "addresses";

  constructor(private readonly conn: knex.Knex, private readonly logger: pino.Logger) { }

  async save(data: Address): Promise<void> {
    try {
      await this.conn(this.tableName).insert({
          id: data.id,
          cep:data.zip,
          uf: data.state,
          street: data.street,
          number:data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          description: data.description,
          json: null,
          is_from_location: false,
          created_by: data.createdBy,
      })
    } catch (error) {
      this.logger.child({ error }).error("Failed to save address");
      throw new Error("Failed to save address");
    }
  }

  async get(id: string): Promise<Address | null> {
    try {
      const addressDb = await this.conn(this.tableName)
        .where({ id })
        .first()

      if (!addressDb)
        return null;

      return AddressBuilder.fromDB(addressDb);
    } catch (error) {
      this.logger.child({ error, id }).error("Failed to retrieve address");
      throw new Error("Failed to retrieve address");
    }
  }
}

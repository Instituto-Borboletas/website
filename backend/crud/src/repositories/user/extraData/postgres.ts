import knex from 'knex';
import pino from 'pino';
import { ExtraDataBuilder } from '../../../domain/builders/ExtraDataBuilder';
import { UserExtraData } from '../../../domain/User';
import { ExtraDataRepository } from './interface'

export class PostgresExtraDataRepository implements ExtraDataRepository {
  constructor(private readonly conn: knex.Knex, private readonly logger: pino.Logger) { }

  async save(data: UserExtraData): Promise<void> {
    try {
      await this.conn("extra_user_data").insert({
        user_id: data.userId,
        cpf: data.cpf,
        cpfUf: data.cpfUf,
        birth_date: data.birthDate,
        phone: data.phone,
        trusted_contact_name: data.trustedName,
        trusted_contact_phone: data.trustedPhone,
        adult_children: data.adultChildren,
        kid_children: data.kidChildren,
        housing: data.housing,
        income: data.income,
        work: data.work,
        address_id: data.addressId
      })
    } catch (error) {
      this.logger.child({ error, data }).error("Failed to save user extra data");
      throw new Error("Failed to save user extra data");
    }
  }

  async get(userId: string): Promise<UserExtraData | null> {
    try {
      const extraDataDb = await this.conn("extra_user_data")
        .where({ user_id: userId })
        .first()

      if (!extraDataDb)
        return null;

      return ExtraDataBuilder.fromDB(extraDataDb);
    } catch (error) {
      this.logger.child({ error, userId }).error("Failed to retrieve user extra data");
      throw new Error("Failed to retrieve user extra data");
    }
  }
}

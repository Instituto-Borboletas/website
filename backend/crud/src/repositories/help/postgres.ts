import knex from "knex";
import pino from "pino";

import { HelpRequest } from "../../domain/HelpRequest";
import { FindAllOptions, HelpRequestRepository } from "./interface";

export class PostgresHelpRepository implements HelpRequestRepository {
  constructor(private readonly conn: knex.Knex, private readonly logger: pino.Logger) { }

  async save(helpRequest: HelpRequest): Promise<void> {
    try {
      await this.conn("helps").insert({
        id: helpRequest.id,
        description: helpRequest.description,
        created_by: helpRequest.createdBy,
        help_kind_id: helpRequest.helpKindId,
      });
    } catch (err) {
      this.logger.child({ err }).error("Failed to save help request");
      throw new Error("Failed to save help request");
    }
  }

  async findById(id: string): Promise<HelpRequest | null> {
    try {
      const help = await this.conn("helps").where({ id }).first();
      return help;
    } catch (err) {
      this.logger.child({ err }).error("Failed to find help request by id");
      throw new Error("Failed to find help request by id");
    }
  }

  async findAll(options?: FindAllOptions): Promise<HelpRequest[]> {
    try {
      const helps = await this.conn("helps")
        .where(options?.filterEnabled ? { enabled: true } : {})
        .select();

      return helps;
    } catch (error) {
      this.logger.child({ error }).error("Failed to find all helps");
      throw new Error("Failed to find all helps");
    }
  }

  async delete(help: HelpRequest): Promise<void> {
    try {
      await this.conn("helps")
        .where({ id: help.id })
        .update({ deleted_at: Date.now() })

    } catch (error) {
      this.logger.child({ error }).error("Failed to delete help request");
      throw new Error("Failed to delete help request");
    }
  }
}

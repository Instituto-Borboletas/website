import knex from "knex";
import pino from "pino";

import { HelpRequest } from "../../domain/HelpRequest";
import { FindAllOptions, HelpRequestRepository } from "./interface";
import { HelpRequestBuilder } from "../../domain/builders/HelpRequestBuilder";

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
        .join("users", "helps.created_by", "users.id")
        .join("helps_kind", "helps.help_kind_id", "helps_kind.id")
        .where(options?.filterDeleted ? { deleted_at: null } : {})
        .select("helps.*", "users.name as created_by_name", "helps_kind.name as kind_name")

      return helps.map((help: any) => {
        const result = {
          ...new HelpRequestBuilder({
            id: help.id,
            description: help.description,
            createdBy: help.created_by,
            kindId: help.help_kind_id,
            createdAt: help.created_at,
            deletedAt: help.deleted_at,
          }).build(),
          createdByName: help.created_by_name,
          kind: help.kind_name
        }

        // @ts-expect-error
        delete result.helpKindId;

        return result;
      });
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

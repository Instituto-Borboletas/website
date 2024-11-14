import knex from "knex";
import pino from "pino";

import { FindAllOptions, HelpKindOptions, HelpKindRepository } from "./interface";
import { HelpKind } from "../../domain/HelpKind";
import { HelpKindBuilder } from "../../domain/builders/HelpKind";

export class PostgresHelpKindRepository implements HelpKindRepository {
  constructor(private readonly conn: knex.Knex, private readonly logger: pino.Logger) { }

  async save(helpKind: HelpKind): Promise<void> {
    try {
      await this.conn("helps_kind").insert({
        id: helpKind.id,
        name: helpKind.name,
        description: helpKind.description,
        created_by: helpKind.createdBy,
        enabled: helpKind.enabled,
      });
    } catch (error) {
      this.logger.child({ error }).error("Failed to save HelpKind");
      throw new Error("Failed to save HelpKind");
    }
  }

  async findById(id: string): Promise<HelpKind | null> {
    try {
      const helpKind = await this.conn("helps_kind").where({ id }).first();
      return helpKind;
    } catch (error) {
      this.logger.child({ error }).error("Failed to find HelpKind by id");
      throw new Error("Failed to find HelpKind by id");
    }
  }

  async findAll(options?: FindAllOptions): Promise<HelpKind[]> {
    try {
      const helpKinds = await this.conn("helps_kind")
        .where(options?.filterEnabled ? { enabled: true } : {})
        .select();

      this.logger.info(helpKinds, "help kinds")

      return helpKinds.map((helpKind: any) => {
        return new HelpKindBuilder({
          id: helpKind.id,
          name: helpKind.name,
          description: helpKind.description,
          createdBy: helpKind.created_by,
          enabled: helpKind.enabled,
        }).build();
      });
    } catch (error) {
      this.logger.child({ error }).error("Failed to find all HelpKinds");
      throw new Error("Failed to find all HelpKinds");
    }
  }

  async listAsOptions(): Promise<HelpKindOptions[]> {
    try {
      const helpKinds = await this.conn("helps_kind")
        .where({ enabled: true })
        .select();

      return helpKinds.map((helpKind: HelpKind) => ({
        name: helpKind.name,
        description: helpKind.description,
        value: helpKind.id,
      }));
    } catch (error) {
      this.logger.child({ error }).error("Failed to list HelpKinds as options");
      throw new Error("Failed to list HelpKinds as options");
    }
  }

  async updateEnabled(helpKind: HelpKind): Promise<void> {
    try {
      await this.conn("helps_kind")
        .where({ id: helpKind.id })
        .update({ enabled: helpKind.enabled });
    } catch (error) {
      this.logger.child({ error }).error("Failed to update HelpKind");
      throw new Error("Failed to update HelpKind");
    }
  }

  async delete(helpKind: HelpKind): Promise<void> {
    try {
      await this.conn("helps_kind")
        .where({ id: helpKind.id })
        .delete();
    } catch (error) {
      this.logger.child({ error }).error("Failed to delete HelpKind");
      throw new Error("Failed to delete HelpKind");
    }
  }
}

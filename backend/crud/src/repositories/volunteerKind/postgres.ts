import knex from "knex";
import pino from "pino";

import { FindAllOptions, VolunteerKindRepository, VolunteerKindOptions } from "./interface";
import { VolunteerKind } from "../../domain/VolunteerKind";

export class PostgresVolunteerKindRespository implements VolunteerKindRepository {
  constructor(private readonly conn: knex.Knex, private readonly logger: pino.Logger) { }

  async save(volunteerKind: VolunteerKind): Promise<void> {
    try {
      await this.conn("volunteers_kind").insert({
        id: volunteerKind.id,
        name: volunteerKind.name,
        description: volunteerKind.description,
        created_by: volunteerKind.createdBy,
      })
    } catch (error) {
      // @ts-ignore
      if ("code" in error) {
        if (error.code === "23505") {
          this.logger.child({ error }).error("VolunteerKind already exists");
          throw new Error("VolunteerKind already exists");
        }
      }

      this.logger.child({ error }).error("Failed to save VolunteerKind");
      throw new Error("Failed to save VolunteerKind");
    }
  }

  async findById(id: string): Promise<VolunteerKind | null> {
    try {
      const volunteerKind = await this.conn("volunteers_kind").where({ id }).first();
      return volunteerKind;
    } catch (error) {
      this.logger.child({ error }).error("Failed to find VolunteerKind by id");
      throw new Error("Failed to find VolunteerKind by id");
    }
  }

  async findAll(options: FindAllOptions = { filterEnabled: true }): Promise<VolunteerKind[]> {
    try {
      const volunteerKinds = await this.conn("volunteers_kind")
        .where(options.filterEnabled ? { enabled: true } : {})
        .join("users", "volunteers_kind.created_by", "users.id")
        .select("volunteers_kind.*", "users.name as created_by_name", "users.email as created_by")
        .orderBy("volunteers_kind.created_at", "desc")
        .select();

      return volunteerKinds;
    } catch (error) {
      console.error(error);
      this.logger.child({ error }).error("Failed to find all VolunteerKinds");
      throw new Error("Failed to find all Volunteers Kind");
    }
  }

  async listAsOptions(): Promise<VolunteerKindOptions[]> {
    try {
      const volunteerKinds = await this.conn("volunteers_kind")
        .where({ enabled: true })
        .select("name", "id");

      return volunteerKinds.map((volunteerKind) => ({
        name: volunteerKind.name,
        value: volunteerKind.id,
      }));
    } catch (error) {
      this.logger.child({ error }).error("Failed to list VolunteerKinds as options");
      throw new Error("Failed to list VolunteerKinds as options");
    }
  }

  async updateEnabled(volunteerKind: VolunteerKind): Promise<void> {
    try {
      await this.conn("volunteers_kind").where({ id: volunteerKind.id }).update({ enabled: volunteerKind.enabled });
    } catch (error) {
      this.logger.child({ error }).error("Failed to update VolunteerKind enabled");
      throw new Error("Failed to update VolunteerKind enabled");
    }
  }

  async delete(volunteerKind: VolunteerKind): Promise<void> {
    try {
      await this.conn("volunteers_kind").where({ id: volunteerKind.id }).delete();
    } catch (error) {
      this.logger.child({ error }).error("Failed to delete VolunteerKind");
      throw new Error("Failed to delete VolunteerKind");
    }
  }
}

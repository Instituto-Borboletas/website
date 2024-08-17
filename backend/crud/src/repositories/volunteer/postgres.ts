import knex from "knex";
import pino from "pino";

import { FindAllOptions, VolunteerRepository } from "./interface";
import { Volunteer } from "../../domain/Volunteer";
import { VolunteerBuilder } from "../../domain/builders/VolunteerBuilder";

export class PostgresVolunteerRespository implements VolunteerRepository {
  constructor(private readonly conn: knex.Knex, private readonly logger: pino.Logger) { }

  async save(volunteer: Volunteer): Promise<void> {
    try {
      await this.conn("volunteers").insert({
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        created_by: volunteer.createdBy,
        kind_id: volunteer.volunteerKindId,
      })
    } catch (error) {
      // @ts-ignore
      if ("code" in error) {
        if (error.code === "23505") {
          this.logger.child({ error }).error("Volunteer already exists");
          throw new Error("Volunteer already exists");
        }
      }

      this.logger.child({ error }).error("Failed to save Volunteer");
      throw new Error("Failed to save Volunteer");
    }
  }

  async findById(id: string): Promise<Volunteer | null> {
    try {
      const volunteer = await this.conn("volunteers").where({ id }).first();
      return volunteer;
    } catch (error) {
      this.logger.child({ error }).error("Failed to find Volunteer by id");
      return null;
    }
  }

  async findAll(options: FindAllOptions = { filterDeleted: true }): Promise<Volunteer[]> {
    try {
      const volunteers = await this.conn("volunteers")
        // .where(options.filterDeleted ? { deleted_at: null } : {})
        .join("users", "volunteers.created_by", "users.id")
        .join("volunteers_kind", "volunteers.kind_id", "volunteers_kind.id")
        .select("volunteers.*", "users.name as created_by_name", "volunteers_kind.name as kind_name")

      return volunteers.map((volunteer: any) => {
        const result = new VolunteerBuilder({
          id: volunteer.id,
          name: volunteer.name,
          email: volunteer.email,
          phone: volunteer.phone,
          volunteerKindId: volunteer.kind_id,
          createdBy: volunteer.created_by,
          createdAt: volunteer.created_at,
          updatedAt: volunteer.updated_at,
          deletedAt: volunteer.deleted_at,
        }).build();

        return {
          ...result,
          createdByName: volunteer.created_by_name,
          kindName: volunteer.kind_name
        }
      });
    } catch (error) {
      this.logger.child({ error }).error("Failed to find all VolunteerKinds");
      throw new Error("Failed to find all Volunteer");
    }
  }

  async delete(volunteer: Volunteer): Promise<void> {
    try {
      await this.conn("volunteers")
        .where({ id: volunteer.id })
        .update({ deleted_at: Date.now() })

    } catch (error) {
      this.logger.child({ error }).error("Failed to delete Volunteer");
      throw new Error("Failed to delete Volunteer");
    }
  }
}

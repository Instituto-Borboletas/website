import pino from "pino";
import knex from "knex";
import { User, UserType } from "../../domain/User";
import { UserRespository } from "./interface";
import { UserBuilder } from "../../domain/builders/UserBuilder";

export class PostgresUserRepository implements UserRespository {
  // TODO: remove this depency of logger in here
  constructor(private readonly conn: knex.Knex, private readonly logger: pino.Logger) { }

  async save(user: User): Promise<void> {
    try {
      await this.conn("users").insert({
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.passwordHash,
        user_type: user.userType,
      })
    } catch (error) {
      this.logger.child({ error }).error("Failed to save user");

      // @ts-expect-error incorrect type for error on catch blocks
      if ("code" in error) {
        if (error.code === "23505") {

          // @ts-expect-error incorrect type for error on catch blocks
          if (error.constraint === "email_user_unique_index") {
            this.logger.child({ email: user.email }).error("User already exists with that email");
            throw new Error("Email conflict");
          }

          throw new Error("Some conflict");
        }
      }

      throw new Error("Failed to save user");
    }
  }

  async findByEmail(email: string, userType: UserType): Promise<User | null> {
    try {
      const userDb = await this.conn("users")
        .where({ email, user_type: userType })
        .first()

      return UserBuilder.fromDB(userDb);
    } catch (error) {
      this.logger.child({ error }).error("Failed to find user by email");
      throw new Error("Failed to find user by findByEmailAndPassword");
    }
  }

  async findByEmailAndPassword(email: string, passwordHash: string): Promise<User | null> {
    try {
      const userDb = await this.conn("users").where({ email, password_hash: passwordHash }).first();
      return UserBuilder.fromDB(userDb);
    } catch (error) {
      this.logger.child({ error }).error("Failed to find user by email and password");
      throw new Error("Failed to find user by findByEmailAndPassword");
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.conn("users")
        .select("id", "name", "email", "user_type", "created_at", "updated_at")

      return users.map(UserBuilder.fromDB)
    } catch (error) {
      this.logger.child({ error }).error("Failed to find all users");
      throw new Error("Failed to find all users");
    }
  }

  async delete(user: User): Promise<void> {
    try {
      await this.conn("users").where({ id: user.id }).delete();
    } catch (error) {
      this.logger.child({ error }).error("Failed to delete user");
      throw new Error("Failed to delete user");
    }
  }
}

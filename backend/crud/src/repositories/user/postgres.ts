import pino from "pino";
import knex from "knex";
import { User, UserType } from "../../domain/User";
import { UserRespository } from "./interface";

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
      // @ts-ignore
      if ("code" in error) {
        if (error.code === "23505") {
          this.logger.child({ error }).error("User already exists");
          throw new Error("User already exists");
        }
      }

      this.logger.child({ error }).error("Failed to save user");
      throw new Error("Failed to save user");
    }
  }

  async findByEmail(email: string, userType: UserType): Promise<User | null> {
    try {
      const user = await this.conn("users")
        .where({ email, user_type: userType })
        .first()

      return user;
    } catch (error) {
      this.logger.child({ error }).error("Failed to find user by email");
      throw new Error("Failed to find user by findByEmailAndPassword");
    }
  }

  async findByEmailAndPassword(email: string, passwordHash: string, userType: UserType): Promise<User | null> {
    try {
      const user = await this.conn("users").where({ email, password_hash: passwordHash, user_type: userType }).first();

      return user;
    } catch (error) {
      this.logger.child({ error }).error("Failed to find user by email and password");
      throw new Error("Failed to find user by findByEmailAndPassword");
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

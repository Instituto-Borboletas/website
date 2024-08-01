import { generateId } from "../utils";

export class Session {
  id: string
  userId: string
  expiresAt: number

  constructor(userId: string) {
    this.id = generateId();
    this.userId = userId;
    this.expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  }
}

import { UserExtraData } from "../../../domain/User";

export interface ExtraDataRepository {
  save(data: UserExtraData): Promise<void>
  get(userId: string): Promise<UserExtraData | null>
}

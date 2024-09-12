import { Address } from "../../../domain/Address";
import { UserExtraData } from "../../../domain/User";

export interface ExtraDataRepository {
  save(data: UserExtraData): Promise<void>
  get(userId: string): Promise<{ extra: UserExtraData, address: Address } | null>
}

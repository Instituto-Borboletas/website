import { User } from '../../domain/User'

export interface UserRespository {
  save(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findByEmailAndPassword(email: string, passwordHash: string): Promise<User | null>
  delete(user: User): Promise<void>
}

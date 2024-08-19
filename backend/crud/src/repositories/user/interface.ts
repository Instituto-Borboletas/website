import { User, UserType } from '../../domain/User'

export interface UserRespository {
  save(user: User): Promise<void>
  findByEmail(email: string, userType: UserType): Promise<User | null>
  findByEmailAndPassword(email: string, passwordHash: string): Promise<User | null>
  findAll(): Promise<User[]>
  delete(user: User): Promise<void>
}

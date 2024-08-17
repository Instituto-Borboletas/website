import { HelpRequest } from '../../domain/HelpRequest'

export interface FindAllOptions {
  filterDeleted: boolean
}

export interface HelpRequestRepository {
  save(help: HelpRequest): Promise<void>
  findById(id: string): Promise<HelpRequest | null>
  findAll(options?: FindAllOptions): Promise<HelpRequest[]>
  delete(help: HelpRequest): Promise<void>
}

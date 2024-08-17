import { Volunteer } from '../../domain/Volunteer'

export interface FindAllOptions {
  filterDeleted: boolean
}

export interface VolunteerRepository {
  save(volunteer: Volunteer): Promise<void>
  findById(id: string): Promise<Volunteer | null>
  findAll(options?: FindAllOptions): Promise<Volunteer[]>
  delete(volunteerKind: Volunteer): Promise<void>
}

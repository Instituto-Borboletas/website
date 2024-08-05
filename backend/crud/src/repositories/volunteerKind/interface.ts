import { VolunteerKind } from '../../domain/VolunteerKind'

export interface FindAllOptions {
  filterEnabled: boolean
}

export type VolunteerKindOptions = {
  name: string
  value: string
}

export interface VolunteerKindRepository {
  save(volunteerKind: VolunteerKind): Promise<void>
  findById(id: string): Promise<VolunteerKind | null>
  findAll(options?: FindAllOptions): Promise<VolunteerKind[]>
  listAsOptions(): Promise<VolunteerKindOptions[]>
  updateEnabled(volunteerKind: VolunteerKind): Promise<void>
  delete(volunteerKind: VolunteerKind): Promise<void>
}

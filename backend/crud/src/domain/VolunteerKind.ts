type VolunteerKindProps = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export class VolunteerKind {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;

  constructor({ id, name, description, enabled, createdBy, createdAt, updatedAt }: VolunteerKindProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.enabled = enabled;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

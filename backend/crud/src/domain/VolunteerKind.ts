type VolunteerKindProps = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
}

export class VolunteerKind {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
  createdAt: number;

  constructor({ id, name, description, enabled, createdBy }: VolunteerKindProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.enabled = enabled;
    this.createdBy = createdBy;
    this.createdAt = Date.now();
  }
}

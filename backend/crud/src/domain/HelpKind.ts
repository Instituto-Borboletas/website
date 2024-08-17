type HelpKindProps = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
  createdAt?: number;
}

export class HelpKind {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
  createdAt: number;

  constructor({ id, name, description, enabled, createdBy, createdAt }: HelpKindProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.enabled = enabled;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? Date.now();
  }
}

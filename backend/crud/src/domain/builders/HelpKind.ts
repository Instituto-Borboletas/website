import { HelpKind } from "../HelpKind"
import { generateId } from '../../utils';

export class HelpKindBuilder {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: number;
  enabled: boolean;

  constructor({ id, name, description, createdBy, createdAt, enabled }: { id?: string, enabled?: boolean, name: string, description: string, createdBy: string, createdAt?: number }) {
    this.id = id ?? generateId();
    this.enabled = enabled ?? true;
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? Date.now();
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  setCreatedBy(createdBy: string) {
    this.createdBy = createdBy;
    return this;
  }

  build() {
    return new HelpKind(this);
  }
}

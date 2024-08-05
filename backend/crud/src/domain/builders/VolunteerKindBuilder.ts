import { VolunteerKind } from '../VolunteerKind';
import { generateId } from '../../utils';

export class VolunteerKindBuilder {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdBy: string;
  createdAt: number
  updatedAt: number

  constructor({ name, description, createdBy, createdAt }: { name: string, description: string, createdBy: string, createdAt?: number }) {
    this.id = generateId();
    this.name = name;
    this.description = description;
    this.enabled = true;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? Date.now();
    this.updatedAt = Date.now();
  }

  setId(id: string) {
    this.id = id;
    return this;
  }

  setCreatedAt(createdAt: number) {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: number) {
    this.updatedAt = updatedAt;
    return this;
  }

  setIsEnabled(enabled: boolean) {
    this.enabled = enabled;
    return this;
  }

  setCreatedBy(createdBy: string) {
    this.createdBy = createdBy;
    return this;
  }

  build() {
    return new VolunteerKind(this);
  }
}

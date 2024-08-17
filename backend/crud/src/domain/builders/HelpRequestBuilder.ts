import { HelpRequest } from "../HelpRequest"
import { generateId } from '../../utils';

export class HelpRequestBuilder {
  id: string;
  description: string;
  createdBy: string;
  createdAt: number;
  deletedAt?: number;
  helpKindId: string;

  constructor({ id, description, createdBy, createdAt, deletedAt, kindId }: { id?: string, enabled?: boolean, description: string, createdBy: string, createdAt?: number, deletedAt?: number, kindId: string }) {
    this.id = id ?? generateId();
    this.description = description;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? Date.now();
    this.deletedAt = deletedAt;
    this.helpKindId = kindId;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  setCreatedBy(createdBy: string) {
    this.createdBy = createdBy;
    return this;
  }

  setDeletedAt(deletedAt: number) {
    this.deletedAt = deletedAt;
    return this;
  }

  build() {
    return new HelpRequest(this);
  }
}

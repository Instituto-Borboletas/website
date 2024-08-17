import { Volunteer } from '../Volunteer';
import { generateId } from '../../utils';

export class VolunteerBuilder {
  id: string;
  email: string;
  name: string;
  phone: string;
  volunteerKindId: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;

  constructor ({ id, name, email, phone, volunteerKindId, createdBy, createdAt, updatedAt, deletedAt }: { id?: string, name: string, email: string, phone: string, volunteerKindId: string, createdBy: string, createdAt?: number, updatedAt?: number, deletedAt?: number }) {
    this.id = id ?? generateId();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.volunteerKindId = volunteerKindId;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? Date.now();
    this.updatedAt = updatedAt ?? Date.now();
  }

  setId (id: string) {
    this.id = id;
    return this;
  }

  setCreatedAt (createdAt: number) {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt (updatedAt: number) {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt (deletedAt: number) {
    this.updatedAt = deletedAt;
    return this;
  }

  setCreatedBy (createdBy: string) {
    this.createdBy = createdBy;
    return this;
  }

  build () {
    return new Volunteer(this);
  }
}

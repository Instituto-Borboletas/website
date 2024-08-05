import { Volunteer } from '../Volunteer';
import { generateId } from '../../utils';

export class VolunteerKindBuilder {
  id: string;
  email: string;
  name: string;
  phone: string;
  volunteerKindId: string;
  enabled: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;

  constructor ({ name, email, phone, volunteerKindId, createdBy, createdAt }: { name: string, email: string, phone: string, volunteerKindId: string, createdBy: string, createdAt?: number }) {
    this.id = generateId();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.volunteerKindId = volunteerKindId;
    this.enabled = true;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? Date.now();
    this.updatedAt = Date.now();
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

  setEnabled (enabled: boolean) {
    this.enabled = enabled;
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

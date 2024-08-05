type VolunteerProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  enabled: boolean;
  volunteerKindId: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export class Volunteer {
  id: string;
  email: string;
  name: string;
  phone: string;
  volunteerKindId: string;
  enabled: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;

  constructor ({ id, name, email, phone, volunteerKindId, enabled, createdBy, createdAt, updatedAt }: VolunteerProps) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.enabled = enabled;
    this.volunteerKindId = volunteerKindId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

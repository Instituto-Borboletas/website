type VolunteerProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  createdBy: string;
  createdAt: number;
  updatedAt: number;

  constructor ({ id, name, email, phone, volunteerKindId, createdBy, createdAt, updatedAt }: VolunteerProps) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.volunteerKindId = volunteerKindId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

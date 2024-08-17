type HelpRequestProps = {
  id: string;
  description: string;
  helpKindId: string;
  createdBy: string;
  createdAt: number;
  deletedAt?: number;
}

export class HelpRequest {
  id: string;
  description: string;
  helpKindId: string;
  createdBy: string;
  createdAt: number;
  deletedAt?: number;

  constructor({ id, description, helpKindId, createdBy, createdAt, deletedAt }: HelpRequestProps) {
    this.id = id;
    this.description = description;
    this.helpKindId = helpKindId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }
}

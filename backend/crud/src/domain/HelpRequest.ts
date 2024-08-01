type HelpRequestProps = {
  id: string;
  description: string;
  helpKindId: string;
  createdBy: string;
}

export class HelpRequest {
  id: string;
  description: string;
  helpKindId: string;
  createdBy: string;
  createdAt: number;

  constructor({ id, description, helpKindId, createdBy }: HelpRequestProps) {
    this.id = id;
    this.description = description;
    this.helpKindId = helpKindId;
    this.createdBy = createdBy;
    this.createdAt = Date.now();
  }
}

import { HelpKind } from "../../domain/HelpKind";

export type HelpKindOptions = {
  name: string;
  value: string;
  description: string;
}

export interface FindAllOptions {
  filterEnabled: boolean
}

export interface HelpKindRepository {
  save(helpKind: HelpKind): Promise<void>;
  findById(id: string): Promise<HelpKind | null>;
  findAll(options?: FindAllOptions): Promise<HelpKind[]>
  listAsOptions(): Promise<HelpKindOptions[]>
  updateEnabled(helpKind: HelpKind): Promise<void>
  delete(helpKind: HelpKind): Promise<void>;
}

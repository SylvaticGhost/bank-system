import { BlockedAction } from './blocked-action';

export class BlockedAccount extends BlockedAction{
  readonly accountId: string;
  readonly accountOwnerId: string;
}
import { AdminAction } from '../admin-actions';

export abstract class BlockedAction {
  readonly actionId: string;
  readonly comment: string;
  readonly time: Date;
  readonly committedBy: string;
  readonly action: AdminAction;
}
import { BlockedAction } from './blocked-action';

export class BlockedUser extends BlockedAction{
    readonly userId: string;
}
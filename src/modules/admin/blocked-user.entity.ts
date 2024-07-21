import {AdminAction} from "./admin-actions";

export class BlockedUser {
    readonly actionId: string;
    readonly userId: string;
    readonly comment: string;
    readonly blockedAt: Date;
    readonly blockedBy: string;
    readonly action: AdminAction;
}
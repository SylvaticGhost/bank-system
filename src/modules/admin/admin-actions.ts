export const ADMIN_ACTIONS = {
    BlockUser: 'BlockUser',
    UnblockUser: 'UnblockUser'
}

type ObjectValues<T> = T[keyof T];

export type AdminAction = ObjectValues<typeof ADMIN_ACTIONS>;
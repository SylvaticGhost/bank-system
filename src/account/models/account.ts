export type AccountDto = { 
    id: string;
    ownerId: string;
    tag: string;
    currency: string;
    type: string;
    createdAt: Date;
    isClosed: boolean;
}
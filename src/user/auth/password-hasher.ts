import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {HashedPassword} from "../models/hashed-password";

export class PasswordHasher {
    static async hashPassword(password: string) : Promise<HashedPassword> {
        if(!password || password.length === 0)
            throw new Error("Password is required");

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        return {hash, salt};
    }
    static async comparePasswords(password: string, hashedPassword: HashedPassword) : Promise<boolean> {
        if(!password || password.length === 0)
            throw new Error("Password is required");

        if(!hashedPassword)
            throw new Error("Hashed password is not provided");

        if(!hashedPassword.hash || hashedPassword.hash.length === 0)
            throw new Error("Hashed password is not provided");

        if(!hashedPassword.salt || hashedPassword.salt.length === 0)
            throw new Error("Hashed password is not provided");

        return bcrypt.compare(password, hashedPassword.hash);
    }
}
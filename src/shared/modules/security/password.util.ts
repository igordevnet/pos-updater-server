import * as bcrypt from 'bcrypt';

export async function hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
}

export async function compareData(plainData: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(plainData, hashedData);
}
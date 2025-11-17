import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = bcrypt.hashSync('password', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {
            name: "Admin Kaka",
            password: "password",
            role: "ADMIN"
        },
        create: {
            name: "Admin Kaka",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "ADMIN"
        }
    });

    console.log("Adim user seeded: ", admin);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async() => {
    await prisma.$disconnect();
});
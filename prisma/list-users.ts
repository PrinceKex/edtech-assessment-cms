import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('Fetching users from the database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('\n=== Users in the database ===');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.table(users);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();

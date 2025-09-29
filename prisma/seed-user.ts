import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: await hash('testpassword123', 10), // In a real app, use a secure password
    };

    const user = await prisma.user.create({
      data: testUser,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    console.log('\n=== Test user created successfully ===');
    console.log(user);
    console.log('\nYou can now log in with:');
    console.log(`Email: ${testUser.email}`);
    console.log('Password: testpassword123');
    
  } catch (error: any) {
    console.error('Error creating test user:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

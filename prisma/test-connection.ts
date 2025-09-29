import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection by querying the database
    const result = await prisma.$queryRaw`SELECT 1+1 as test`;
    console.log('Connection successful! Result:', result);
    
    // List all tables in the database
    console.log('\nListing database tables:');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log(tables);
    
  } catch (error: any) {
    console.error('Connection failed with error:');
    console.error(error);
    
    // More detailed error information
    if (error.code === 'ETIMEDOUT') {
      console.error('\nError: Connection timed out. Please check:');
      console.error('1. Your internet connection');
      console.error('2. If the Supabase database is running');
      console.error('3. If the database credentials in .env are correct');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\nError: Could not resolve the database host.');
      console.error('Please check the database URL in your .env file.');
    } else {
      console.error('\nError details:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

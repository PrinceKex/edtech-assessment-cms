import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting article seeding...');

  // Get existing user and categories
  const [user, categories] = await Promise.all([
    prisma.user.findFirst({
      where: { email: 'test@example.com' },
      select: { id: true },
    }),
    prisma.category.findMany({
      select: { id: true, slug: true },
    }),
  ]);

  if (!user) {
    console.error('❌ Error: Test user not found. Please run the user seed script first.');
    process.exit(1);
  }

  if (categories.length === 0) {
    console.error('❌ Error: No categories found. Please run the category seed script first.');
    process.exit(1);
  }

  // Map category slugs to their IDs for easier reference
  const categoryMap = categories.reduce((acc, category) => ({
    ...acc,
    [category.slug]: category.id,
  }), {} as Record<string, string>);

  // Sample articles data
  const articlesData = [
    {
      title: 'Getting Started with Remix',
      slug: 'getting-started-with-remix',
      excerpt: 'Learn the basics of building web applications with Remix',
      content: `# Getting Started with Remix\n\nRemix is a full stack web framework that lets you focus on the user interface and work back through web standards to deliver a fast, slick, and resilient user experience.\n\n## Why Remix?\n- Built on the Web Fetch API\n- Nested layouts\n- Optimistic UI\n- Built-in data loading and mutations`,
      isPublished: true,
      publishedAt: new Date(),
      categoryId: categoryMap['technology'] || categories[0].id,
      authorId: user.id,
    },
    {
      title: 'The Future of Education Technology',
      slug: 'future-of-edtech',
      excerpt: 'Exploring the latest trends in educational technology',
      content: `# The Future of Education Technology\n\nEducation technology is rapidly evolving, with new tools and platforms emerging to enhance learning experiences.\n\n## Key Trends\n- AI-powered learning assistants\n- Virtual and augmented reality in classrooms\n- Personalized learning paths\n- Gamification of education`,
      isPublished: true,
      publishedAt: new Date(),
      categoryId: categoryMap['education'] || categories[1]?.id || categories[0].id,
      authorId: user.id,
    },
    {
      title: 'Understanding Quantum Computing',
      slug: 'understanding-quantum-computing',
      excerpt: 'A beginner\'s guide to quantum computing concepts',
      content: `# Understanding Quantum Computing\n\nQuantum computing leverages quantum-mechanical phenomena to perform calculations.\n\n## Key Concepts\n- Qubits instead of bits\n- Superposition\n- Entanglement\n- Quantum supremacy`,
      isPublished: false, // Draft article
      categoryId: categoryMap['science'] || categories[2]?.id || categories[0].id,
      authorId: user.id,
    },
  ];

  // Clear existing articles
  console.log('🧹 Clearing existing articles...');
  await prisma.article.deleteMany({});

  // Create articles
  console.log('📝 Creating articles...');
  await prisma.article.createMany({
    data: articlesData,
  });

  console.log('✅ Articles seeded successfully!');
  console.log(`📚 Created ${articlesData.length} articles`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding articles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

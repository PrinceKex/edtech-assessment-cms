import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Technology',
    description: 'Articles about the latest in technology and software development',
    slug: 'technology',
  },
  {
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack web development',
    slug: 'web-development',
    parentCategory: 'Technology',
  },
  {
    name: 'Mobile Development',
    description: 'iOS, Android, and cross-platform mobile app development',
    slug: 'mobile-development',
    parentCategory: 'Technology',
  },
  {
    name: 'Design',
    description: 'UI/UX design, graphic design, and design thinking',
    slug: 'design',
  },
  {
    name: 'Business',
    description: 'Business strategies, startups, and entrepreneurship',
    slug: 'business',
  },
  {
    name: 'Productivity',
    description: 'Tips and tools for better productivity',
    slug: 'productivity',
  },
  {
    name: 'Tutorials',
    description: 'Step-by-step guides and how-tos',
    slug: 'tutorials',
  },
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');
  
  // First, create all parent categories
  const parentCategories = categories.filter(cat => !cat.parentCategory);
  const childCategories = categories.filter(cat => cat.parentCategory);
  
  const createdCategories: Record<string, string> = {}; // name -> id mapping
  
  // Create parent categories
  for (const category of parentCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
    createdCategories[category.name] = created.id;
    console.log(`✅ Created/Updated category: ${category.name}`);
  }
  
  // Create child categories with parent relationships
  for (const category of childCategories) {
    const parentId = createdCategories[category.parentCategory!];
    if (!parentId) {
      console.warn(`⚠️ Parent category not found for ${category.name}`);
      continue;
    }
    
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        parentId: parentId,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: parentId,
      },
    });
    
    console.log(`✅ Created/Updated subcategory: ${category.parentCategory} → ${category.name}`);
  }
  
  console.log('\n🎉 Categories seeded successfully!');
  
  // List all categories with their hierarchy
  const allCategories = await prisma.category.findMany({
    include: {
      parent: true,
    },
    orderBy: [
      { parentId: 'asc' },
      { name: 'asc' },
    ],
  });
  
  console.log('\n📋 Category Hierarchy:');
  allCategories.forEach((cat: { parent: { id: string } | null; name: string; slug: string }) => {
    const prefix = cat.parent ? '  └─ ' : '• ';
    console.log(`${prefix}${cat.name} (${cat.slug})`);
  });
}

seedCategories()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

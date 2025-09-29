/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Ensures a slug is unique by appending a number if needed
 * @param prisma Prisma client instance
 * @param slug The slug to check
 * @param model The Prisma model name to check against
 * @param excludeId ID to exclude from the check (for updates)
 * @returns A unique slug
 */
export async function getUniqueSlug(
  prisma: any,
  slug: string,
  model: string,
  excludeId?: string
): Promise<string> {
  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma[model].findFirst({
      where: {
        slug: uniqueSlug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    
    if (!existing) {
      break;
    }
    
    uniqueSlug = `${slug}-${counter++}`;
  }
  
  return uniqueSlug;
}

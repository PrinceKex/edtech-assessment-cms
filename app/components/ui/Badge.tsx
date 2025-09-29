import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'draft' | 'published' | 'category' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    draft: 'bg-teal-100 text-teal-800',
    published: 'bg-green-100 text-green-800',
    category: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Category specific badge with color coding
export function CategoryBadge({ category }: { category: string }) {
  // Map category names to variants or use a default
  const variantMap: Record<string, 'default' | 'draft' | 'published' | 'success' | 'warning' | 'error'> = {
    'web development': 'default',
    'mobile development': 'default',
    'design': 'success',
    'business': 'warning',
    'productivity': 'default',
    'tutorials': 'default',
  };

  const variant = variantMap[category.toLowerCase()] || 'default';
  
  return (
    <Badge variant={variant}>
      {category}
    </Badge>
  );
}

// Status badge with consistent styling
export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: 'draft' | 'published' | 'default', label: string }> = {
    draft: { variant: 'draft', label: 'Draft' },
    published: { variant: 'published', label: 'Published' },
    archived: { variant: 'default', label: 'Archived' },
  };

  const statusInfo = statusMap[status.toLowerCase()] || { variant: 'default' as const, label: status };
  
  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  );
}

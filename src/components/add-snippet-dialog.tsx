'use client';

import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  language: z.string().min(1, 'Language is required'),
  category: z.string().min(1, 'Category is required'),
  author: z.string().min(1, 'Author is required').max(50, 'Author name too long'),
  description: z.string().max(500, 'Description too long').optional().default(''),
  code: z.string().min(10, 'Code must be at least 10 characters'),
});

type SnippetFormData = z.infer<typeof snippetSchema>;

const LANGUAGES = ['JavaScript', 'Python', 'GLSL', 'Rust', 'Haskell', 'CSS', 'TypeScript'];
const CATEGORIES = [
  'Generative Art',
  'Algorithms',
  'Shaders',
  'Data Visualization',
  'Creative Coding',
  'Interactive',
  'UI/UX',
];

interface AddSnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SnippetFormData) => void;
}

export function AddSnippetDialog({ open, onOpenChange, onSubmit }: AddSnippetDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    language: '',
    category: '',
    author: '',
    description: '',
    code: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SnippetFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof SnippetFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = snippetSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SnippetFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SnippetFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
      // Reset form
      setFormData({
        title: '',
        language: '',
        category: '',
        author: '',
        description: '',
        code: '',
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Snippet</DialogTitle>
          <DialogDescription>
            Share a beautiful piece of code with the community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Fractal Tree"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Language + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language *</Label>
              <Select value={formData.language} onValueChange={(v) => handleChange('language', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-xs text-destructive">{errors.language}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              placeholder="e.g., CodeArtist"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
            />
            {errors.author && (
              <p className="text-xs text-destructive">{errors.author}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what makes this code beautiful..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Textarea
              id="code"
              placeholder="Paste your beautiful code here..."
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Snippet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

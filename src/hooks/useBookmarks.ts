import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type BookmarkType = 'chapter' | 'formula';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('item_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarks(new Set(data?.map(b => b.item_id) || []));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (itemId: string, itemType: BookmarkType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to bookmark items",
          variant: "destructive",
        });
        return;
      }

      const isBookmarked = bookmarks.has(itemId);

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (error) throw error;

        setBookmarks(prev => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });

        toast({
          title: "Bookmark removed",
          description: `${itemType === 'chapter' ? 'Chapter' : 'Formula'} removed from bookmarks`,
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            item_type: itemType,
            item_id: itemId,
          });

        if (error) throw error;

        setBookmarks(prev => new Set([...prev, itemId]));

        toast({
          title: "Bookmark added",
          description: `${itemType === 'chapter' ? 'Chapter' : 'Formula'} added to bookmarks`,
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const isBookmarked = (itemId: string) => bookmarks.has(itemId);

  return { isBookmarked, toggleBookmark, loading };
};

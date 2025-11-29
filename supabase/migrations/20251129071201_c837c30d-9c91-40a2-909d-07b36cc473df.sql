-- Create bookmarks table for chapters and formulas
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('chapter', 'formula')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
ON public.bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_bookmarks_user_type ON public.bookmarks(user_id, item_type);
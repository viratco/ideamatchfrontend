import { supabase } from '../supabaseClient';

export async function saveIdeaToSupabase({
  user_id,
  idea
}: {
  user_id: string;
  idea: any;
}) {
  // Table: ideas (columns: id, user_id, title, description, details, created_at)
  const { error } = await supabase.from('ideas').insert([
    {
      user_id,
      title: idea.title,
      description: idea.description,
      details: idea.details || idea.analysis || null
    }
  ]);
  return error;
}

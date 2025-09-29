import { createServerClient } from '@supabase/auth-helpers-remix';
import type { Database } from '~/types/supabase';

export const createSupabaseServerClient = ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const responseHeaders = new Headers(response?.headers);
  
  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response: { ...response, headers: responseHeaders } }
  );

  return {
    supabaseClient,
    headers: responseHeaders,
  };
};

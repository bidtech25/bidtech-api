export interface SupabaseUserCreatedPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: {
    id: string;
    email: string;
    raw_user_meta_data?: {
      full_name?: string;
      avatar_url?: string;
    };
    created_at: string;
  };
  old_record: null | any;
}

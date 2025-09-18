import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useSyncUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          setRole(null);
          setLoading(false);
          return;
        }

        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile role:', profileError);
          setRole(null);
        } else if (profileData?.role) {
          setRole(profileData.role);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('Unexpected error in fetchRole:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading };
}
// /lib/useUserProfile.ts
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useUserProfile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const getProfile = async () => {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!ignore) setProfile(data);
      }
      setLoading(false);
    };
    getProfile();
    return () => { ignore = true; };
  }, []);

  // Gabungkan data dari Auth & profile table
  const result = {
    id: user?.id || profile?.id,
    email: user?.email || profile?.email,
    nama: profile?.nama || "",
    hp: profile?.hp || "",
    alamat: profile?.alamat || "",
    isVerified: profile?.is_verified || false,
    avatarUrl: profile?.avatar_url || "",
  };

  return { user, profile, ...result, loading };
}

import { supabase } from "@/lib/supabaseClient";

export async function uploadToSupabase(file: File, folder: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("uploads") // nama bucket di Supabase
    .upload(filePath, file);

  if (error) throw error;

  const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(filePath);
  return urlData?.publicUrl;
}

import { createClient } from "../client";

const BUCKET_NAME = "profile-images";

export async function uploadImage(img: File) {
  const supabase = createClient();

  const randomId = Math.random().toString(36).substring(2, 15);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(`images/${randomId}-${img.name}`, img, {
      upsert: false,
      contentType: img.type,
    });

  if (error) {
    return { data: null, error };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return { data: { publicUrl }, error: null };
}

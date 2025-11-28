import { useCallback } from "react";
import { supabase as supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import { FileEntity } from "../api/types/file-entity";
import HTTP_CODES_ENUM from "../api/types/http-codes";

const supabase = supabaseClient as SupabaseClient<Database>;

export function useSupabaseFileUploadService() {
  return useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const fileEntity: FileEntity = {
        id: filePath,
        path: publicUrl,
      };

      return {
        status: HTTP_CODES_ENUM.CREATED,
        data: {
          file: fileEntity,
        },
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        status: HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }, []);
}

import { toast } from "@/components/ui/use-toast";
import supabase from "@/config/supabase";
import { useState } from "react";

export default function useUpload() {
  const [error, setError] = useState<Error | null>(null);

  const upload = async (folder: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(`${path}/${file.name}`, file);

    if (error) {
      setError(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error.message}`,
      });
    } else {
      toast({
        variant: "success",
        title: "File uploaded successfully!",
        description: "Your file has been uploaded successfully.",
      });
      window.location.reload();
    }

    return data;
  };

  return { upload, error };
}

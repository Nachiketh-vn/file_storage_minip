import supabase from "@/config/supabase";
import { useEffect, useState } from "react";

export default function useFiles(folder: string, path: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage.from(folder).list(path);

      if (error) {
        setError(error);
      } else {
        setFiles(data || []);
      }

      setLoading(false);
    };

    fetchFiles();
  }, []);

  return { files, loading, error };
}

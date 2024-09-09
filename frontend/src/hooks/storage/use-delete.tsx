import { toast } from "@/components/ui/use-toast";
import supabase from "@/config/supabase";
import { useAuth } from "@/context/auth-context";

export default function useDelete() {
  const { user } = useAuth();

  const DeleteFile = async (fileType: string, filename: string) => {
    const { data, error } = await supabase.storage
      .from("files")
      .remove([`${fileType}/${user!.id}/${filename}`]);
    if (error) {
      console.log(error);
    } else {
      console.log(data);

      toast({
        title: "File Deleted",
        description: "Your file has been deleted successfully",
      });
      window.location.reload();
    }
  };

  return { DeleteFile };
}

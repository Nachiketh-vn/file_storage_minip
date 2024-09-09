import { useState } from "react";
import supabase from "@/config/supabase";
export const useTableInsert = (
  tableName: string,
  onSuccessCallback: () => void = () => {}
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);

  const tableInsert = async (payload: any) => {
    try {
      setLoading(true);
      const { error } = await supabase.from(tableName).insert(payload);
      if (error) throw error;
      setLoading(false);
      console.log("success inserted into table");
      onSuccessCallback();
    } catch (error: any) {
      console.log(error);
      setError(error);
      setLoading(false);
      if (error.code === "23505") onSuccessCallback();
    }
  };

  return [tableInsert, loading, error];
};

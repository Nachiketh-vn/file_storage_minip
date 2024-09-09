import supabase from "@/config/supabase";
import { useState } from "react";

export const useTableDelete = (tableName: string) => {
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const deleteRow = async (primaryKeyName: string, primaryKeyValue: string) => {
    try {
      console.log("function called");
      setLoading(true);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq(primaryKeyName, primaryKeyValue);
      if (error) throw error;
      console.log("function called11");
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  };

  return [deleteRow, loading, error];
};

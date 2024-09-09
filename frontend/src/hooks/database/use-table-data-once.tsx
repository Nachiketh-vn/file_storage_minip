import { useEffect, useState } from "react";
import supabase from "@/config/supabase";

type filterData = {
  columnName: string;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "ilike"
    | "is"
    | "in"
    | "cs"
    | "cd"
    | "sl"
    | "sr"
    | "nxl"
    | "nxr"
    | "adj"
    | "ov"
    | "fts"
    | "plfts"
    | "phfts"
    | "wfts";
  value?: string;
};

export const useTableDataOnce = (
  tableName: string,
  filterData?: filterData[],
  selectString: string = `*`,
  deps: any[] = [],
) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const fetchData = async () => {
    try {
      setLoading(true);
      let supabaseQuery = supabase.from(tableName).select(selectString);

      if (filterData) {
        filterData.forEach((filter) => {
          if (filter.value != "")
            supabaseQuery.filter(
              filter.columnName,
              filter.operator,
              filter.value,
            );
        });
      }
      const { data, error } = await supabaseQuery;
      if (error) throw error;
      if (data) setData(data);
      console.log(tableName, data);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [...deps]);

  return [data, loading, error];
};

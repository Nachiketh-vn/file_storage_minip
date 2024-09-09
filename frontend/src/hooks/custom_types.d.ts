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

interface Bucket {
  id: string;
  name: string;
  owner: string;
  file_size_limit?: number;
  allowed_mime_types?: string[];
  created_at: string;
  updated_at: string;
  public: boolean;
}

interface FileObject {
  name: string;
  bucket_id: string;
  owner: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
  buckets: Bucket;
}
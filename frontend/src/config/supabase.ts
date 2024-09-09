import { createClient } from "@supabase/supabase-js";

// move to .env
const supabase = createClient(
  "https://teqskwxomxbmyhpwxenr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcXNrd3hvbXhibXlocHd4ZW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNzc3NjUsImV4cCI6MjAyODk1Mzc2NX0.40B33twGY6FAjDFf-VYMnVmBwZjiiTWGeNP-01GCvO8"
);

export default supabase;

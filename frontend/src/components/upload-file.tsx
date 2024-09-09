"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import useUpload from "@/hooks/storage/use-upload";

export default function UploadFile() {
  const { upload } = useUpload();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Upload</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a file</DialogTitle>
          <DialogDescription>Upload a file to your Storage</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (file) {
              setLoading(true);
              await upload("files", `private/${user?.id}`, file);
              setLoading(false);
            }
          }}
        >
          <Input
            id="picture"
            type="file"
            className="mb-2"
            onChange={(event) => {
              if (event.target.files) {
                setFile(event.target.files[0]);
              }
            }}
          />
          <Button className="w-full">
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

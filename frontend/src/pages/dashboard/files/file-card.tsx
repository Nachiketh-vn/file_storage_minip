import pdfimg from "@/assets/pdf-icon.svg";
import defaultImg from "@/assets/default-file.png";
import supabase from "@/config/supabase.ts";
import { useAuth } from "@/context/auth-context.tsx";
import { useEffect, useState } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import useDelete from "@/hooks/storage/use-delete";

function PdfFileCard({ file }: { file: FileObject }) {
  return (
    <div className="w-32">
      <img src={pdfimg} className="w-full" alt="thumbnail" />
      <p className="mt-1 text-center text-xs">{file.name}</p>
    </div>
  );
}

function ImageFileCard({ file }: { file: FileObject }) {
  const { user } = useAuth();
  const [link, setLink] = useState<string | null>(null);

  const getImageUrl = async () => {
    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(`private/${user?.id}/${file.name}`, 3600 * 12, {
        transform: {
          height: 120,
        },
      });
    console.log(data, error);
    if (error) {
      console.log(error);
    } else {
      setLink(data.signedUrl);
    }
  };

  useEffect(() => {
    getImageUrl();
  }, []);

  return (
    <div className="h-32 w-32 ">
      {link && (
        <img
          src={link}
          className="mx-auto h-full object-fill"
          alt="thumbnail"
        />
      )}
      <p className="mt-1 text-center text-xs">{file.name}</p>
    </div>
  );
}

function DefaultFileCard({ file }: { file: FileObject }) {
  return (
    <div className="w-32">
      <img src={defaultImg} className="w-full" alt="thumbnail" />
      <p className="mt-1 text-center text-xs">{file.name}</p>
    </div>
  );
}

export function FileCardSelector({
  file,
  setSelectedFileId,
  setIsSheetOpen,
}: {
  file: FileObject;
  setSelectedFileId: React.Dispatch<React.SetStateAction<FileObject | null>>;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useAuth();
  const { DeleteFile } = useDelete();

  const renderFileCard = (file: FileObject) => {
    switch (file.metadata.mimetype) {
      case "application/pdf":
        return <PdfFileCard file={file} />;
      case "image/jpeg":
      case "image/jpg":
      case "image/png":
        return <ImageFileCard file={file} />;
      default:
        return <DefaultFileCard file={file} />;
    }
  };

  return (
    <AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex flex-col items-center hover:scale-105">
            {renderFileCard(file)}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {file.metadata.mimetype === "application/pdf" && (
            <ContextMenuItem
              inset
              onClick={() => {
                setSelectedFileId(file);
                setIsSheetOpen(true);
              }}
            >
              Ask AI
            </ContextMenuItem>
          )}
          <ContextMenuItem inset>Download</ContextMenuItem>
          <ContextMenuItem inset>
            <AlertDialogTrigger>Delete</AlertDialogTrigger>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your file
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              DeleteFile("private", file.name);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

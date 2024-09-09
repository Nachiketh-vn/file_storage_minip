import { useEffect, useState } from "react";
import { LuLayoutGrid, LuLayoutList } from "react-icons/lu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import DashboardTopBar from "./dashboard-topbar";
import { useAuth } from "@/context/auth-context";
import useFiles from "@/hooks/storage/use-files";
import NoFilesComponent from "@/pages/dashboard/files/no-files-component";
import { FileCardSelector } from "@/pages/dashboard/files/file-card.tsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LuCornerDownLeft } from "react-icons/lu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useSocket from "@/hooks/socket/use-socket";
import clsx from "clsx";
import AskAISidebar from "./files/side-bar";

export default function DashboardMain() {
  const [searchText, setSearchText] = useState<string>("");
  const [viewType, setViewType] = useState<"grid" | "table">("grid");
  const { user } = useAuth();
  const { files, loading, error } = useFiles("files", `private/${user?.id}`);

  console.log(files);

  return (
    <div className="flex flex-col">
      <DashboardTopBar searchText={searchText} setSearchText={setSearchText} />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex  items-center justify-between ">
          <h1 className="text-lg font-semibold md:text-2xl">Files</h1>
          <ToggleGroup
            onValueChange={(e) => setViewType(e as "grid" | "table")}
            value={viewType}
            type="single"
          >
            <ToggleGroupItem value="grid">
              <LuLayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table">
              <LuLayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {loading && <ShowMessage message="Loading files..." />}
        {error && <ShowMessage message={error.message} />}
        {files.length === 0 ? (
          <NoFilesComponent />
        ) : (
          <ShowFilesCard files={files} />
        )}
      </main>
    </div>
  );
}

function ShowMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <p>{message}</p>
    </div>
  );
}

function ShowFilesCard({ files }: { files: FileObject[] }) {
  const [selectedFileId, setSelectedFileId] = useState<FileObject | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const sendFileInfo = async (file: FileObject) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/fileid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_id: file.id,
          file_name: file.name,
          type: "private",
          file_path: `private/${user?.id}/${file.name}`,
        }),
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFileId) {
      sendFileInfo(selectedFileId);
    }
  }, [selectedFileId]);

  return (
    <>
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        {files.map((file) => {
          return (
            <FileCardSelector
              setIsSheetOpen={setIsSheetOpen}
              setSelectedFileId={setSelectedFileId}
              file={file}
            />
          );
        })}
        <AskAISidebar
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          selectedFile={selectedFileId}
        />
      </div>
    </>
  );
}

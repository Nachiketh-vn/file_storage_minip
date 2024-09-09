import UploadFile from "@/components/upload-file";

export default function NoFilesComponent() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">You have no files</h3>
        <p className="mb-2 text-sm text-muted-foreground">
          Start by uploading your files.
        </p>
        <UploadFile />
      </div>
    </div>
  );
}

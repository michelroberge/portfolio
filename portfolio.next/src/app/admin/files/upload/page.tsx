import UploadSpecificFile from "@/components/admin/UploadContextualFile";
import FileList from "@/components/admin/FileList";
export default function UploadFile() {

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Upload a File</h1>
      <UploadSpecificFile entityId="" context="general" />
      <FileList entityId="" context="general" />

    </div>
  );
}

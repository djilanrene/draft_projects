"use client";

import * as React from "react";
import { useStorage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, CheckCircle2, AlertCircle } from "lucide-react";

interface FirebaseStorageUploaderProps {
  storagePath: string;
  onUploadComplete: (url: string) => void;
  currentFileUrl?: string;
  acceptedFileTypes?: string; // e.g., "image/*", ".pdf"
  label: string;
}

export function FirebaseStorageUploader({
  storagePath,
  onUploadComplete,
  currentFileUrl,
  acceptedFileTypes = "image/*",
  label,
}: FirebaseStorageUploaderProps) {
  const storage = useStorage();
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage) return;

    setUploadProgress(0);
    setUploadError(null);

    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploadError("L'importation a échoué. Veuillez réessayer.");
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUploadComplete(downloadURL);
          setUploadProgress(100); // Mark as complete
        });
      }
    );
  };

  const isPdf = acceptedFileTypes === ".pdf";

  return (
    <div className="space-y-2">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes}
      />
      <Button type="button" variant="outline" className="w-full" onClick={handleFileSelect}>
        <Upload className="mr-2 h-4 w-4" />
        {label}
      </Button>

      {uploadProgress !== null && uploadProgress < 100 && (
        <Progress value={uploadProgress} className="w-full" />
      )}
      
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {uploadProgress === 100 && !uploadError && (
         <Alert className="border-green-500 text-green-700 dark:border-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>Importation terminée avec succès !</AlertDescription>
        </Alert>
      )}

      {currentFileUrl && (
        <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
          {isPdf ? (
            <File className="h-4 w-4" />
          ) : (
             <div className="w-10 h-10 rounded-md overflow-hidden border">
                <img src={currentFileUrl} alt="Aperçu" className="w-full h-full object-cover" />
             </div>
          )}
          <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
            {isPdf ? "Voir le CV actuel" : "Voir l'image actuelle"}
          </a>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { useStorage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { resizeImage } from "@/lib/image-optimizer";

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
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isPdf = acceptedFileTypes === ".pdf";

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage) return;

    setUploadProgress(0);
    setUploadError(null);
    setIsProcessing(true);

    try {
      let fileToUpload: Blob = file;
      if (file.type.startsWith("image/") && !isPdf) {
        try {
          fileToUpload = await resizeImage(file);
        } catch (e) {
          console.warn("Could not resize image, uploading original file.", e);
        }
      }

      setIsProcessing(false);

      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

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
    } catch (err: any) {
        setIsProcessing(false);
        setUploadError(err.message || "Une erreur est survenue lors de la préparation du fichier.");
    }
  };


  return (
    <div className="space-y-2">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptedFileTypes}
        disabled={isProcessing || (uploadProgress !== null && uploadProgress < 100)}
      />
      <Button 
        type="button" 
        variant="outline" 
        className="w-full" 
        onClick={handleFileSelect}
        disabled={isProcessing || (uploadProgress !== null && uploadProgress < 100)}
      >
        {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
            <Upload className="mr-2 h-4 w-4" />
        )}
        {isProcessing ? "Optimisation..." : label}
      </Button>

      {uploadProgress !== null && uploadProgress < 100 && (
        <Progress value={uploadProgress} className="w-full h-2" />
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

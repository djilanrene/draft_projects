"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { FirebaseStorageUploader } from "@/components/FirebaseStorageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type CvInfo = {
  url: string;
  updatedAt: any;
}

export default function AdminCvPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const cvRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "cv", "main") : null),
    [firestore]
  );
  const { data: cvData, isLoading } = useDoc<CvInfo>(cvRef);

  const handleUploadComplete = (url: string) => {
    if (!firestore) return;
    const dataToSave = {
      url: url,
      updatedAt: new Date(),
    };
    setDocumentNonBlocking(cvRef, dataToSave, { merge: true });
    toast({
      title: "CV mis à jour !",
      description: "Votre nouveau CV a été sauvegardé avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Gestion du CV</h1>
        <p className="text-muted-foreground">
          Importez et mettez à jour votre CV au format PDF.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Votre CV</CardTitle>
          <CardDescription>
            Le fichier que vous importez ici sera accessible publiquement via le
            lien "Télécharger mon CV" dans l'en-tête du site. Assurez-vous
            qu'il est au format PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            {isLoading ? (
                <Skeleton className="h-10 w-full" />
            ) : (
              <FirebaseStorageUploader
                storagePath="cv/cv.pdf"
                onUploadComplete={handleUploadComplete}
                currentFileUrl={cvData?.url}
                acceptedFileTypes=".pdf"
                label="Importer un nouveau CV (PDF)"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

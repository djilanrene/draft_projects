"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FirebaseStorageUploader } from "@/components/FirebaseStorageUploader";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

type CvInfo = {
  url: string;
  updatedAt: any;
};

export default function AdminCvPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [newCvUrl, setNewCvUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const cvRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "cv", "main") : null),
    [firestore]
  );
  const { data: cvData, isLoading } = useDoc<CvInfo>(cvRef);

  const handleUploadComplete = (url: string) => {
    setNewCvUrl(url);
  };
  
  const handleCancel = () => {
    setNewCvUrl(null);
  }

  const handleSave = async () => {
    if (!firestore || !cvRef || !newCvUrl) return;
    setIsSaving(true);
    try {
      const dataToSave = {
        url: newCvUrl,
        updatedAt: serverTimestamp(),
      };
      await setDoc(cvRef, dataToSave, { merge: true });
      toast({
        title: "CV mis à jour !",
        description: "Votre nouveau CV a été sauvegardé avec succès.",
      });
      setNewCvUrl(null); // Reset after saving
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Oh non ! Une erreur est survenue.",
        description: error.message || "Impossible de sauvegarder le CV.",
      });
    } finally {
        setIsSaving(false);
    }
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
                onUploadStateChange={setIsUploading}
                currentFileUrl={cvData?.url}
                acceptedFileTypes=".pdf"
                label="Importer un nouveau CV (PDF)"
                disabled={isUploading || isSaving}
              />
            )}
          </div>
        </CardContent>
        {newCvUrl && (
          <CardFooter className="flex justify-end gap-2 border-t pt-6">
             <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>Annuler</Button>
             <Button onClick={handleSave} disabled={isSaving}>
                 {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Sauvegarder le CV
             </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

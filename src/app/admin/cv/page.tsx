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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type CvInfo = {
  url: string;
  updatedAt: any;
};

export default function AdminCvPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [cvUrl, setCvUrl] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const cvRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "cv", "main") : null),
    [firestore]
  );
  const { data: cvData, isLoading } = useDoc<CvInfo>(cvRef);
  
  React.useEffect(() => {
    if (cvData) {
      setCvUrl(cvData.url);
    }
  }, [cvData]);

  const handleSave = async () => {
    if (!firestore || !cvRef) return;
    setIsSaving(true);
    try {
      const dataToSave = {
        url: cvUrl,
        updatedAt: serverTimestamp(),
      };
      await setDoc(cvRef, dataToSave, { merge: true });
      toast({
        title: "CV mis à jour !",
        description: "L'URL de votre CV a été sauvegardée.",
      });
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
          Mettez à jour le lien vers votre CV au format PDF.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Votre CV</CardTitle>
          <CardDescription>
            Collez ici l'URL publique de votre CV. Ce lien sera utilisé pour le
            bouton "Télécharger mon CV" sur votre site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
          ) : (
            <div className="space-y-2 max-w-md">
              <Label htmlFor="cv-url">URL du CV</Label>
              <Input
                id="cv-url"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                placeholder="https://example.com/mon-cv.pdf"
                disabled={isSaving}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6">
           <Button onClick={handleSave} disabled={isSaving || isLoading}>
               {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Sauvegarder
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

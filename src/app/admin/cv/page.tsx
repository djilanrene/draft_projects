"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function AdminCvPage() {
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
          <div className="flex flex-col items-start gap-4">
             <Button onClick={() => alert("Fonctionnalité d'import à venir !")}>
              <Upload className="mr-2 h-4 w-4" />
              Importer un nouveau CV (PDF)
            </Button>
            {/* 
              TODO: Add a preview or link to the current CV if it exists.
              This would require Firebase Storage integration.
            */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

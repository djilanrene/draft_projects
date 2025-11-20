"use client";

import * as React from "react";
import { doc } from "firebase/firestore";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Profile } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  profileImageUrl: z.string().url("L'URL est invalide."),
  aboutImageUrl: z.string().url("L'URL est invalide."),
  aboutImageHint: z.string().optional(),
  aboutText1: z.string().min(1, "Ce paragraphe est requis."),
  aboutText2: z.string().min(1, "Ce paragraphe est requis."),
  aboutText3: z.string().min(1, "Ce paragraphe est requis."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function ProfileForm() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const profileRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "profile", "main") : null),
    [firestore]
  );
  const { data: profile, isLoading } = useDoc<Profile>(profileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: { // Use `values` to pre-fill and react to data loading
      profileImageUrl: profile?.profileImageUrl || "",
      aboutImageUrl: profile?.aboutImageUrl || "",
      aboutImageHint: profile?.aboutImageHint || "",
      aboutText1: profile?.aboutText1 || "",
      aboutText2: profile?.aboutText2 || "",
      aboutText3: profile?.aboutText3 || "",
    },
  });

  React.useEffect(() => {
    // Reset the form when the profile data is loaded from Firestore
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      if (!firestore) throw new Error("Firestore is not available");
      const profileDocRef = doc(firestore, "profile", "main");
      
      setDocumentNonBlocking(profileDocRef, values, { merge: true });

      toast({
        title: "Profil mis à jour !",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Oh non ! Une erreur est survenue.",
        description: error.message || "Impossible de sauvegarder le profil.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
        <CardContent>
            <div className="space-y-6">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-24 w-full" />
            </div>
        </CardContent>
    );
  }

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="profileImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la photo de profil</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com/photo-profil.png" {...field} />
                </FormControl>
                <FormDescription>
                  Cette image apparaît dans la barre de navigation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image de la page "À propos"</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com/photo-a-propos.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutText1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biographie - Paragraphe 1</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutText2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biographie - Paragraphe 2</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutText3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biographie - Paragraphe 3</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder les modifications
          </Button>
        </form>
      </Form>
    </CardContent>
  );
}


export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion du Profil</CardTitle>
          <CardDescription>
            Modifiez ici les informations qui apparaissent sur votre page "À propos" et dans l'en-tête du site.
          </CardDescription>
        </CardHeader>
        <ProfileForm />
      </Card>
    </div>
  );
}

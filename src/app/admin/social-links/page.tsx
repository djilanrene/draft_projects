"use client";

import * as React from "react";
import {
  collection,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SocialLink } from "@/lib/types";
import { Loader2, PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const socialLinkSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  url: z.string().url("L'URL est invalide"),
  icon: z.string().min(1, "L'icône est requise (ex: 'Github', 'Linkedin')"),
});

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

function SocialLinkForm({
  link,
  onFinished,
}: {
  link?: SocialLink;
  onFinished: () => void;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      name: link?.name || "",
      url: link?.url || "",
      icon: link?.icon || "",
    },
  });

  const onSubmit = async (values: SocialLinkFormValues) => {
    setIsLoading(true);
    try {
      const id = link?.id || doc(collection(firestore, "social_links")).id;
      const linkRef = doc(firestore, "social_links", id);

      const dataToSave = { ...values, id };

      setDocumentNonBlocking(linkRef, dataToSave, { merge: true });

      toast({
        title: link ? "Lien mis à jour !" : "Lien créé !",
        description: `Le lien "${values.name}" a été sauvegardé.`,
      });
      onFinished();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh non ! Une erreur est survenue.",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="GitHub" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/votre-nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icône (Lucide React)</FormLabel>
              <FormControl>
                <Input placeholder="Github" {...field} />
              </FormControl>
              <FormDescription>
                Nom de l'icône depuis la librairie{" "}
                <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide-react</a>.
                Respectez la casse (ex: 'Github', 'Linkedin', 'Twitter').
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Annuler</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {link ? "Sauvegarder" : "Créer le lien"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function SocialLinkDialog({ link, children }: { link?: SocialLink, children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{link ? "Modifier le lien" : "Nouveau Lien Social"}</DialogTitle>
          <DialogDescription>
            {link
              ? "Modifiez les informations de votre lien."
              : "Ajoutez un nouveau lien social à votre pied de page."}
          </DialogDescription>
        </DialogHeader>
        <SocialLinkForm link={link} onFinished={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SocialLinksList() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const socialLinksQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "social_links"), orderBy("name")) : null),
    [firestore]
  );
  const { data: socialLinks, isLoading } = useCollection<SocialLink>(socialLinksQuery);
  
  const handleDelete = (linkId: string) => {
    const linkRef = doc(firestore, "social_links", linkId);
    deleteDocumentNonBlocking(linkRef);
    toast({
      title: "Lien supprimé",
      description: "Le lien a été supprimé avec succès.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos Liens Sociaux</CardTitle>
        <CardDescription>La liste des liens affichés dans le pied de page de votre site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Icône</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && socialLinks?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Aucun lien social trouvé.
                </TableCell>
              </TableRow>
            )}
            {socialLinks?.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">{link.name}</TableCell>
                <TableCell className="text-muted-foreground">{link.url}</TableCell>
                <TableCell className="text-muted-foreground">{link.icon}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <SocialLinkDialog link={link}>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              Modifier
                           </DropdownMenuItem>
                        </SocialLinkDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            Supprimer
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>

                     <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Le lien "{link.name}" sera définitivement supprimé.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(link.id)} className="bg-destructive hover:bg-destructive/90">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                   </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AdminSocialLinksPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Réseaux Sociaux</h1>
          <p className="text-muted-foreground">
            Ajoutez, modifiez et gérez les liens de vos réseaux sociaux.
          </p>
        </div>
        <SocialLinkDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau Lien
          </Button>
        </SocialLinkDialog>
      </header>
      <SocialLinksList />
    </div>
  );
}

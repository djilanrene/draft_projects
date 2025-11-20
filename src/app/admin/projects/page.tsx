"use client";

import * as React from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
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
import type { Project } from "@/lib/types";
import { Loader2, PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
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


const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  imageUrl: z.string().url("L'URL de l'image est invalide"),
  imageHint: z.string().optional(),
  software: z.string().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  // Resources are optional and can be managed later
});

type ProjectFormValues = z.infer<typeof projectSchema>;

function ProjectForm({
  project,
  onFinished,
}: {
  project?: Project;
  onFinished: () => void;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      category: project?.category || "",
      imageUrl: project?.imageUrl || "",
      imageHint: project?.imageHint || "",
      software: project?.software?.join(", ") || "",
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setIsLoading(true);
    try {
      const id = project?.id || doc(collection(firestore, "projects")).id;
      const projectRef = doc(firestore, "projects", id);

      const dataToSave = {
        ...values,
        id,
      };

      setDocumentNonBlocking(projectRef, dataToSave, { merge: true });

      toast({
        title: project ? "Projet mis à jour !" : "Projet créé !",
        description: `Le projet "${values.title}" a été sauvegardé.`,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre du projet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description courte du projet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <Input placeholder="ex: Web Design, UI/UX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image</FormLabel>
              <FormControl>
                <Input placeholder="https://exemple.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="software"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logiciels / Technologies</FormLabel>
              <FormControl>
                <Input placeholder="React, Figma, Next.js (séparés par des virgules)" {...field} />
              </FormControl>
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
            {project ? "Sauvegarder les modifications" : "Créer le projet"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function ProjectDialog({ project, children }: { project?: Project, children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? "Modifier le projet" : "Nouveau Projet"}</DialogTitle>
          <DialogDescription>
            {project
              ? "Modifiez les informations de votre projet."
              : "Ajoutez un nouveau projet à votre portfolio."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} onFinished={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}


function ProjectsList() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const projectsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, "projects") : null),
    [firestore]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);
  
  const handleDelete = (projectId: string) => {
    const projectRef = doc(firestore, "projects", projectId);
    deleteDocumentNonBlocking(projectRef);
    toast({
      title: "Projet supprimé",
      description: "Le projet a été supprimé avec succès.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos Projets</CardTitle>
        <CardDescription>La liste de tous les projets de votre portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && projects?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Aucun projet trouvé.
                </TableCell>
              </TableRow>
            )}
            {projects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
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
                        <ProjectDialog project={project}>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              Modifier
                           </DropdownMenuItem>
                        </ProjectDialog>
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
                          Cette action est irréversible. Le projet "{project.title}" sera définitivement supprimé.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive hover:bg-destructive/90">
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


export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Projets</h1>
          <p className="text-muted-foreground">
            Ajoutez, modifiez ou supprimez les projets de votre portfolio.
          </p>
        </div>
        <ProjectDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouveau Projet
          </Button>
        </ProjectDialog>
      </header>
      <ProjectsList />
    </div>
  );
}

"use client";

import * as React from "react";
import {
  collection,
  doc,
  setDoc,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Project } from "@/lib/types";
import { Loader2, PlusCircle, MoreHorizontal, Trash2, Github, Globe } from "lucide-react";
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
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FirebaseStorageUploader } from "@/components/FirebaseStorageUploader";


const resourceSchema = z.object({
  label: z.string().min(1, "Le label est requis."),
  url: z.string().url("L'URL est invalide."),
  type: z.enum(["website", "github"]),
});

const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  excerpt: z.string().min(1, "Le résumé est requis."),
  content: z.string().min(1, "Le contenu est requis."),
  category: z.string().min(1, "La catégorie est requise."),
  imageUrl: z.string().url("L'URL de l'image est invalide.").optional().or(z.literal('')),
  imageHint: z.string().optional(),
  software: z.string().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  resources: z.array(resourceSchema).optional(),
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
  const [isUploading, setIsUploading] = React.useState(false);
  const formProjectId = React.useMemo(() => project?.id || doc(collection(firestore, "projects")).id, [project, firestore]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      excerpt: project?.excerpt || "",
      content: project?.content || "",
      category: project?.category || "",
      imageUrl: project?.imageUrl || "",
      imageHint: project?.imageHint || "",
      software: project?.software?.join(", ") || "",
      resources: project?.resources || [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const onSubmit = async (values: ProjectFormValues) => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const projectRef = doc(firestore, "projects", formProjectId);

      const dataToSave = {
        ...values,
        id: formProjectId,
      };

      await setDoc(projectRef, dataToSave, { merge: true });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Résumé (Excerpt)</FormLabel>
              <FormControl>
                <Textarea placeholder="Description courte pour la carte du projet." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu (Markdown)</FormLabel>
              <FormControl>
                <Textarea placeholder="Contenu détaillé du projet au format Markdown." rows={10} {...field} />
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
              <FormLabel>Image du projet</FormLabel>
              <FormControl>
                 <FirebaseStorageUploader
                    storagePath={`projects/${formProjectId}/featured-image.jpg`}
                    onUploadComplete={(url) => field.onChange(url)}
                    onUploadStateChange={setIsUploading}
                    currentFileUrl={field.value}
                    label="Importer ou remplacer l'image"
                  />
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
        
        <div>
          <FormLabel>Liens de ressources</FormLabel>
          <div className="space-y-4 mt-2">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormField
                      control={form.control}
                      name={`resources.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-xs">Label</FormLabel>
                          <FormControl><Input placeholder="Visiter le site" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`resources.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-xs">URL</FormLabel>
                           <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name={`resources.${index}.type`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="website"><Globe className="mr-2 h-4 w-4 inline"/> Site Web</SelectItem>
                                        <SelectItem value="github"><Github className="mr-2 h-4 w-4 inline"/> GitHub</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>
                 <Button type="button" variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => remove(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer ce lien
                </Button>
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', url: '', type: 'website' })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un lien
            </Button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Annuler</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading || isUploading}>
            {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Importation en cours...' : (project ? "Sauvegarder les modifications" : "Créer le projet")}
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
    if (!firestore) return;
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

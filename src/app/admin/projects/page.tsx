'use client';

'use client';

import * as React from 'react';
import {
  collection,
  doc,
  serverTimestamp,
  query,
  setDoc,
} from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Github, Globe, Loader2, MoreHorizontal, PlusCircle, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/alert-dialog';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const resourceSchema = z.object({
  label: z.string().min(1, 'Le label est requis.'),
  url: z.string().url("L'URL est invalide."),
  type: z.enum(['website', 'github']),
});

const projectSchema = z.object({
  title: z.string().min(1, 'Le titre est requis.'),
  excerpt: z
    .string()
    .min(1, 'Le résumé est requis.')
    .max(160, 'Le résumé ne doit pas dépasser 160 caractères.'),
  content: z.string().min(1, 'Le contenu est requis.'),
  category: z.string().min(1, 'La catégorie est requise.'),
  imageUrl: z
    .string()
    .url("L'URL de l'image est invalide.")
    .optional()
    .or(z.literal('')),
  imageHint: z.string().optional(),
  software: z.string().transform((val) =>
    val ? val.split(',').map((s) => s.trim()) : []
  ).optional(),
  resources: z.array(resourceSchema).optional(),
  published: z.boolean().default(false),
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
  const formProjectId = React.useMemo(
    () => project?.id || doc(collection(firestore, 'projects')).id,
    [project, firestore]
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      excerpt: project?.excerpt || '',
      content: project?.content || '',
      category: project?.category || '',
      imageUrl: project?.imageUrl || '',
      imageHint: project?.imageHint || '',
      software: project?.software?.join(', ') || '',
      resources: project?.resources || [],
      published: project?.published || false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'resources',
  });

  const onSubmit = async (values: ProjectFormValues) => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const projectRef = doc(firestore, 'projects', formProjectId);

      const dataToSave = {
        ...values,
        id: formProjectId,
        createdAt: project?.createdAt || serverTimestamp(),
      };

      await setDoc(projectRef, dataToSave, { merge: true });

      toast({
        title: project ? 'Projet mis à jour !' : 'Projet créé !',
        description: `Le projet "${values.title}" a été sauvegardé.`,
      });
      onFinished();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oh non ! Une erreur est survenue.',
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
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publier</FormLabel>
                <FormDescription>
                  Rendre ce projet visible au public sur la page d'accueil.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
                <Textarea
                  placeholder="Description courte pour la carte du projet."
                  {...field}
                />
              </FormControl>
              <FormDescription>Maximum 160 caractères.</FormDescription>
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
                <Textarea
                  placeholder="Contenu détaillé du projet au format Markdown."
                  rows={10}
                  {...field}
                />
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
              <FormLabel>URL de l'image du projet</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData('text');
                    let url = paste.trim();
                    // Google Drive
                    if (url.includes('drive.google.com/file/d/')) {
                      const match = url.match(/\/d\/([\w-]+)/);
                      if (match)
                        url = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                    }
                    // GitHub
                    if (url.includes('github.com/') && url.includes('/blob/')) {
                      url = url
                        .replace('github.com/', 'raw.githubusercontent.com/')
                        .replace('/blob/', '/');
                    }
                    // Imgur
                    if (url.match(/^https:\/\/imgur.com\//)) {
                      url = url.replace('imgur.com/', 'i.imgur.com/') + '.png';
                    }
                    // Unsplash (rien à faire, direct)
                    setTimeout(() => field.onChange(url), 0);
                    e.preventDefault();
                  }}
                  onBlur={(e) => {
                    let url = e.target.value.trim();
                    // Google Drive
                    if (url.includes('drive.google.com/file/d/')) {
                      const match = url.match(/\/d\/([\w-]+)/);
                      if (match)
                        url = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                    }
                    // GitHub
                    if (url.includes('github.com/') && url.includes('/blob/')) {
                      url = url
                        .replace('github.com/', 'raw.githubusercontent.com/')
                        .replace('/blob/', '/');
                    }
                    // Imgur
                    if (url.match(/^https:\/\/imgur.com\//)) {
                      url = url.replace('imgur.com/', 'i.imgur.com/') + '.png';
                    }
                    // Unsplash (rien à faire, direct)
                    if (url !== e.target.value) field.onChange(url);
                  }}
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
                <Input
                  placeholder="React, Figma, Next.js (séparés par des virgules)"
                  {...field}
                />
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
                        <FormControl>
                          <Input placeholder="Visiter le site" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`resources.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`resources.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="website">
                              <Globe className="mr-2 h-4 w-4 inline" /> Site Web
                            </SelectItem>
                            <SelectItem value="github">
                              <Github className="mr-2 h-4 w-4 inline" /> GitHub
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer ce lien
                </Button>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ label: '', url: '', type: 'website' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un lien
            </Button>
          </div>
        </div>

        <DialogFooter className="justify-between sm:justify-between">
          <div>
            {project && (
              <Button type="button" variant="outline" asChild>
                <Link href={`/projects/${project.id}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Prévisualiser
                </Link>
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? 'Sauvegarder les modifications' : 'Créer le projet'}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}

function ProjectDialog({
  project,
  children,
}: {
  project?: Project;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Modifier le projet' : 'Nouveau Projet'}
          </DialogTitle>
          <DialogDescription>
            {project
              ? 'Modifiez les informations de votre projet.'
              : 'Ajoutez un nouveau projet à votre portfolio.'}
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
  const [searchTerm, setSearchTerm] = React.useState('');

  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'projects')) : null),
    [firestore]
  );
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    if (!searchTerm) return projects;
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleDelete = (projectId: string) => {
    if (!firestore) return;
    const projectRef = doc(firestore, 'projects', projectId);
    deleteDocumentNonBlocking(projectRef);
    toast({
      title: 'Projet supprimé',
      description: 'Le projet a été supprimé avec succès.',
    });
  };

  return (
    <Card>
      <CardHeader className="md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Vos Projets</CardTitle>
          <CardDescription>
            La liste de tous les projets de votre portfolio.
          </CardDescription>
        </div>
        <div className="relative mt-4 md:mt-0 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par titre ou catégorie..."
            className="w-full bg-background pl-10 pr-4 py-2 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filteredProjects?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  {searchTerm
                    ? 'Aucun projet ne correspond à votre recherche.'
                    : 'Aucun projet trouvé.'}
                </TableCell>
              </TableRow>
            )}
            {filteredProjects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <Badge variant={project.published ? 'default' : 'secondary'}>
                    {project.published ? 'Publié' : 'Brouillon'}
                  </Badge>
                </TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  {project.createdAt
                    ? format(project.createdAt.toDate(), 'd MMMM yyyy', {
                        locale: fr,
                      })
                    : 'Date non disponible'}
                </TableCell>
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
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Modifier
                          </DropdownMenuItem>
                        </ProjectDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Le projet "
                          {project.title}" sera définitivement supprimé.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(project.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
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
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Projets
          </h1>
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

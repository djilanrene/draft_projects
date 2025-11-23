'use client';

import * as React from 'react';
import {
  collection,
  doc,
  serverTimestamp,
  deleteDoc,
  query,
  orderBy,
  setDoc,
} from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Loader2, MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
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

const articleSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis.' }),
  excerpt: z
    .string()
    .max(160, { message: "L'extrait ne doit pas dépasser 160 caractères." })
    .optional(),
  content: z.string().min(1, { message: 'Le contenu est requis.' }),
  imageUrl: z
    .string()
    .url({ message: 'URL invalide.' })
    .optional()
    .or(z.literal('')),
  imageHint: z.string().optional(),
  tags: z.string().optional().transform((val) => val ? val.split(',').map(tag => tag.trim()).filter(Boolean) : []),
  published: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

function ArticleForm({
  article,
  onFinished,
}: {
  article?: Article;
  onFinished: () => void;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const formArticleId = React.useMemo(
    () => article?.id || doc(collection(firestore, 'articles')).id,
    [article, firestore]
  );

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      excerpt: article?.excerpt || '',
      content: article?.content || '',
      imageUrl: article?.imageUrl || '',
      imageHint: article?.imageHint || '',
      tags: article?.tags?.join(', ') || '',
      published: article?.published || false,
    },
  });

  const onSubmit = async (values: ArticleFormValues) => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const articleRef = doc(firestore, 'articles', formArticleId);

      const dataToSave = {
        ...values,
        id: formArticleId,
        publishedDate: article?.publishedDate || serverTimestamp(),
      };

      await setDoc(articleRef, dataToSave, { merge: true });

      toast({
        title: article ? 'Article mis à jour !' : 'Article créé !',
        description: `L'article "${values.title}" a été sauvegardé.`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publier</FormLabel>
                <FormDescription>
                  Rendre cet article visible au public sur la page du blog.
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
                <Input placeholder="Titre de l'article" {...field} />
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
                <Textarea placeholder="Court résumé de l'article" {...field} />
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
                  placeholder="Contenu complet de l'article au format Markdown."
                  {...field}
                  rows={10}
                />
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
              <FormLabel>URL de l'image de l'article</FormLabel>
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
                    // Met à jour le champ
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
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Design, Code, Next.js"
                  {...field}
                  value={
                    Array.isArray(field.value) ? field.value.join(', ') : field.value
                  }
                  onChange={(e) => {
                    // This is handled by the zod transform when the form is submitted.
                    // For the input component, we just pass the string value.
                    field.onChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Séparez les tags par des virgules.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="justify-between sm:justify-between">
          <div>
            {article && (
              <Button type="button" variant="outline" asChild>
                <Link href={`/blog/${article.id}`} target="_blank">
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
              {article ? 'Sauvegarder les modifications' : "Créer l'article"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}

function ArticleDialog({
  article,
  children,
}: {
  article?: Article;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? "Modifier l'article" : 'Nouvel Article'}
          </DialogTitle>
          <DialogDescription>
            {article
              ? 'Modifiez les informations de votre article.'
              : 'Rédigez un nouvel article pour votre blog.'}
          </DialogDescription>
        </DialogHeader>
        <ArticleForm article={article} onFinished={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ArticlesList() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');

  const articlesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'articles'),
            orderBy('publishedDate', 'desc')
          )
        : null,
    [firestore]
  );
  const { data: articles = [], isLoading } = useCollection<Article>(articlesQuery);

  const filteredArticles = React.useMemo(() => {
    if (!articles) return [];
    if (!searchTerm) return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [articles, searchTerm]);

  const handleDelete = (articleId: string) => {
    if (!firestore) return;
    const articleRef = doc(firestore, 'articles', articleId);
    deleteDocumentNonBlocking(articleRef);
    toast({
      title: 'Article supprimé',
      description: "L'article a été supprimé avec succès.",
    });
  };

  return (
    <Card>
      <CardHeader className="md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Vos Articles</CardTitle>
          <CardDescription>
            La liste de tous les articles de votre blog.
          </CardDescription>
        </div>
        <div className="relative mt-4 md:mt-0 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par titre ou tag..."
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
              <TableHead>Tags</TableHead>
              <TableHead>Date de publication</TableHead>
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
            {!isLoading && filteredArticles?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  {searchTerm
                    ? 'Aucun article ne correspond à votre recherche.'
                    : 'Aucun article trouvé.'}
                </TableCell>
              </TableRow>
            )}
            {(Array.isArray(filteredArticles) ? filteredArticles : []).map(
              (article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={article.published ? 'default' : 'secondary'}
                    >
                      {article.published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {article.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {article.publishedDate
                      ? format(
                          article.publishedDate.toDate(),
                          "d MMMM yyyy 'à' HH:mm",
                          { locale: fr }
                        )
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
                          <ArticleDialog article={article}>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Modifier
                            </DropdownMenuItem>
                          </ArticleDialog>
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
                            Cette action est irréversible. L'article "
                            {article.title}" sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(article.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AdminArticlesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Articles
          </h1>
          <p className="text-muted-foreground">
            Rédigez, modifiez et gérez les articles de votre blog.
          </p>
        </div>
        <ArticleDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvel Article
          </Button>
        </ArticleDialog>
      </header>
      <ArticlesList />
    </div>
  );
}

  Card,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      // Use `values` to pre-fill and react to data loading
      profileImageUrl: profile?.profileImageUrl || '',
      aboutImageUrl: profile?.aboutImageUrl || '',
      aboutImageHint: profile?.aboutImageHint || '',
      aboutText1: profile?.aboutText1 || '',
      aboutText2: profile?.aboutText2 || '',
      aboutText3: profile?.aboutText3 || '',
    },
  });

  React.useEffect(() => {
    // Reset the form when the profile data is loaded from Firestore
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!firestore) return;
    setIsSaving(true);
    try {
      const profileDocRef = doc(firestore, 'profile', 'main');

      const dataToSave = {
        ...values,
        updatedAt: serverTimestamp(),
      };

      await setDoc(profileDocRef, dataToSave, { merge: true });

      toast({
        title: 'Profil mis à jour !',
        description: 'Vos informations ont été sauvegardées avec succès.',
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Oh non ! Une erreur est survenue.',
        description: error.message || 'Impossible de sauvegarder le profil.',
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

            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image de la page "À propos"</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://..."
                    {...field}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData('text');
                      let url = paste.trim();
                      if (url.includes('drive.google.com/file/d/')) {
                        const match = url.match(/\/d\/([\w-]+)/);
                        if (match)
                          url = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                      }
                      if (
                        url.includes('github.com/') &&
                        url.includes('/blob/')
                      ) {
                        url = url
                          .replace('github.com/', 'raw.githubusercontent.com/')
                          .replace('/blob/', '/');
                      }
                      if (url.match(/^https:\/\/imgur.com\//)) {
                        url =
                          url.replace('imgur.com/', 'i.imgur.com/') + '.png';
                      }
                      setTimeout(() => field.onChange(url), 0);
                      e.preventDefault();
                    }}
                    onBlur={(e) => {
                      let url = e.target.value.trim();
                      if (url.includes('drive.google.com/file/d/')) {
                        const match = url.match(/\/d\/([\w-]+)/);
                        if (match)
                          url = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                      }
                      if (
                        url.includes('github.com/') &&
                        url.includes('/blob/')
                      ) {
                        url = url
                          .replace('github.com/', 'raw.githubusercontent.com/')
                          .replace('/blob/', '/');
                      }
                      if (url.match(/^https:\/\/imgur.com\//)) {
                        url =
                          url.replace('imgur.com/', 'i.imgur.com/') + '.png';
                      }
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
            Modifiez ici les informations qui apparaissent sur votre page "À
            propos" et dans l'en-tête du site.
          </CardDescription>
        </CardHeader>
        <ProfileForm />
      </Card>
    </div>
  );
}

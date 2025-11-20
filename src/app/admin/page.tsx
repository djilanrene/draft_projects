import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans l'espace d'administration de votre portfolio.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Projets</CardTitle>
            <CardDescription>Gérez les projets de votre portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Créez, modifiez ou supprimez des projets.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
            <CardDescription>Gérez les articles de votre blog.</CardDescription>
          </CardHeader>
          <CardContent>
             <p>Rédigez et publiez de nouveaux articles.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Mettez à jour vos informations.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Modifiez votre biographie et vos photos.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Réseaux Sociaux</CardTitle>
            <CardDescription>Gérez vos liens sociaux.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ajoutez ou mettez à jour vos profils.</p>
          </CardContent>
        </Card>
      </div>
       <div className="pt-8">
        <Card>
            <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
                <CardDescription>Comment utiliser votre nouveau backoffice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Ce tableau de bord est la première étape. Voici ce que nous allons construire ensuite :</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Une section pour <span className="font-semibold text-foreground">lister, créer, modifier et supprimer</span> vos projets.</li>
                    <li>La même chose pour les <span className="font-semibold text-foreground">articles de blog</span>.</li>
                    <li>Un formulaire pour mettre à jour facilement les <span className="font-semibold text-foreground">informations de votre profil</span> et vos <span className="font-semibold text-foreground">liens de réseaux sociaux</span>.</li>
                </ul>
                <p>Chaque section aura sa propre page dédiée accessible via le menu latéral.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

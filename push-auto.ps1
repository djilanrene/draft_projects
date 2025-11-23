# Script PowerShell pour commit & push automatique sur GitHub
# Place ce fichier à la racine du projet et lance-le pour tout commiter et pousser


$commitMessage = Read-Host "Message de commit (laisser vide pour 'Mise à jour automatique')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Mise à jour automatique du projet"
}

# Récupère la version depuis package.json
$packageJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
$version = $packageJson.version
$tag = "v$version"

git add .
git commit -m "$commitMessage"
git push origin main

# Crée et pousse le tag de version
git tag $tag
git push origin $tag

Write-Host "✅ Commit, push et tag $tag effectués. Vercel va déployer automatiquement la nouvelle version."

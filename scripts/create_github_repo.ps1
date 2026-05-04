param(
    [string]$RepoName = "Telegramm-Veris",
    [string]$Description = "Market Intelligence Telegram Digest for Veris",
    [switch]$Private
)

if (-not $env:GITHUB_TOKEN) {
    throw "Set GITHUB_TOKEN before running this script."
}

$headers = @{
    Authorization = "Bearer $env:GITHUB_TOKEN"
    Accept = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

$body = @{
    name = $RepoName
    description = $Description
    private = [bool]$Private
    auto_init = $false
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://api.github.com/user/repos" -Headers $headers -Body $body -ContentType "application/json"

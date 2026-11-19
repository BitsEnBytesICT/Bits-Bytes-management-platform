[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string]$Username
)

$ErrorActionPreference = 'Stop';
$ou = "OU=Deelnemers,DC=BITSENBYTES,DC=local";
$profileRoot = [System.IO.Path]::GetFullPath('F:\Shares\Profile');

$participants = @(Get-ADUser -Filter { SamAccountName -eq $Username } -SearchBase $ou);
if ($participants.Count -ne 1) {
    throw "Er is niet precies een deelnemer met accountnaam '$Username' gevonden in de deelnemers-OU.";
}
$participant = $participants[0];

$profilePrefix = $profilePath + '\';
$quotas = @(Get-FsrmQuota | Where-Object {
    $quotaPath = [System.IO.Path]::GetFullPath($_.Path).TrimEnd('\');
    $quotaPath -eq $profilePath -or
        $quotaPath.StartsWith($profilePrefix, [System.StringComparison]::OrdinalIgnoreCase)
});

if ($PSCmdlet.ShouldProcess($Username, 'Verwijder profielmap, quota en AD-account')) {
    foreach ($quota in $quotas) {
        Remove-FsrmQuota -InputObject $quota -Confirm:$false;
    }

    Remove-Item -LiteralPath $profilePath -Recurse -Force;

    Remove-ADUser -Identity $participant.ObjectGUID -Confirm:$false;

    Write-Output "Deelnemer '$Username' en de bijbehorende serverresources zijn verwijderd.";
}

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string]$Username,

    [Parameter(Mandatory = $true, Position = 1)]
    [ValidateNotNullOrEmpty()]
    [string]$Password,

    [Parameter(Mandatory = $true, Position = 2)]
    [ValidateNotNullOrEmpty()]
    [string]$Firstname,

    [Parameter(Mandatory = $true, Position = 3)]
    [ValidateNotNullOrEmpty()]
    [string]$Lastname
)

$ErrorActionPreference = 'Stop';
$ip = "10.10.1.3";
$ou = "OU=Deelnemers,DC=BITSENBYTES,DC=local";

if (Get-ADUser -Filter { SamAccountName -eq $Username } -SearchBase $ou) {
    throw "Het accountnaam '$Username' bestaat al.";
}

$securePassword = ConvertTo-SecureString -String $Password -AsPlainText -Force;
$profilePath = "F:\Shares\Profile\$Username";
$Path = "$profilePath\vm";
New-Item -Path $Path -ItemType Directory | Out-Null;

$userParameters = @{
    Name = $Username
    GivenName = $Firstname
    Surname = $Lastname
    SamAccountName = $Username
    Path = $ou
    AccountPassword = $securePassword
    ProfilePath = "\\$ip\profile\$Username\"
    Enabled = $true
};
New-ADUser @userParameters;
Add-ADGroupMember -Identity "deelnemers" -Members @($Username);

$Acl = Get-Acl $Path;
$Ar = New-Object System.Security.AccessControl.FileSystemAccessRule("Deelnemers", "FullControl", "ContainerInherit,ObjectInherit", "None", "deny");
$Acl.SetAccessRule($Ar);
$Ar = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrator", "FullControl", "ContainerInherit,ObjectInherit", "None", "allow");
$Acl.SetAccessRule($Ar);
Set-Acl $Path $Acl;

$Acl = Get-Acl $profilePath;
$Acl.SetAccessRuleProtection($True, $False);
Set-Acl $profilePath $Acl;
$Ar = New-Object System.Security.AccessControl.FileSystemAccessRule($Username, "FullControl", "ContainerInherit,ObjectInherit", "None", "allow");
$Acl.SetAccessRule($Ar);
Set-Acl $profilePath $Acl;
New-FsrmQuota -Path $profilePath -Description "limit usage to 50 GB for user: $Username" -Template "50 GB hard limit";

Write-Output "Deelnemer '$Username' is aangemaakt.";

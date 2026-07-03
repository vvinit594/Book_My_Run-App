# Run once in PowerShell as Administrator (use the full path below):
#   Set-ExecutionPolicy -Scope Process Bypass -Force; & "C:\Users\vvini\Desktop\app\bookmyrun-app\scripts\allow-metro-firewall.ps1"

$nodePath = (Get-Command node -ErrorAction Stop).Source

netsh advfirewall firewall add rule name="Expo Metro Bundler (TCP)" dir=in action=allow protocol=TCP localport=8081-8090 enable=yes
netsh advfirewall firewall add rule name="Expo Metro Bundler (Node)" dir=in action=allow program="$nodePath" enable=yes

Write-Host "Firewall rules added. Restart Expo and scan the QR code again on your phone."

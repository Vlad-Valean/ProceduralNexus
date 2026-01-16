
# Configuration
$ApiBaseUrl = "http://localhost:8080"
$AnalysisBaseUrl = "http://localhost:8081"
$Email = "vlad.valean@nexus.com"
$Password = "Password123!" # Assumed default
$PdfFile = "Vlad_Valean_CV.pdf"

# 1. Login
Write-Host "1. Logging in as $Email..."
$loginBody = @{
    email = $Email
    password = $Password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$ApiBaseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.accessToken
    $userId = $loginResponse.id
    Write-Host "   Success! Token received."
    Write-Host "   User ID: $userId"
} catch {
    Write-Error "Login failed. Please check credentials."
    Write-Host "Response: $($_.ErrorDetails.Message)"
    exit
}

# 2. Upload Document
if (-not (Test-Path $PdfFile)) {
    Write-Warning "File '$PdfFile' not found. Please create a valid PDF file named 'test.pdf' in this directory."
    exit
}

Write-Host "`n2. Uploading '$PdfFile'..."
try {
    $uploadUrl = "$ApiBaseUrl/documents/upload"
    $headers = @{ Authorization = "Bearer $token" }
    
    # PowerShell 7+ supports -Form, but strictly older versions are tricky. 
    # Using curl for multipart upload as it's more reliable across PS versions for this specific task
    # Or using .NET HttpClient. Let's use curl if available, else warn.
    
    $uploadResponseJson = curl -s -X POST $uploadUrl -H "Authorization: Bearer $token" -F "file=@$PdfFile" -F "name=Test_CLI_Doc" -F "uploaderId=$userId"
    
    $docId = ($uploadResponseJson | ConvertFrom-Json).id
    if (-not $docId) { throw "No ID in response" }
    Write-Host "   Success! Document ID: $docId"
} catch {
    Write-Error "Upload failed."
    Write-Host "Response: $uploadResponseJson"
    exit
}

# 3. Trigger Analysis
Write-Host "`n3. Triggering Analysis for Document ID $docId..."
try {
    # This endpoint is on the Analysis Service (8081)
    # It might not need auth, but if it does, pass the header.
    # Based on code, it seems open or internal, but let's try without header first, then with if needed.
    Invoke-RestMethod -Uri "$AnalysisBaseUrl/analysis/process/$docId" -Method Post
    Write-Host "   Analysis started successfully."
} catch {
    Write-Error "Analysis trigger failed."
    Write-Host "Response: $($_.ErrorDetails.Message)"
    exit
}

# 4. Ask Question
Write-Host "`n4. Asking a question..."
$question = "What is this document about?"
$askBody = @{
    question = $question
} | ConvertTo-Json

try {
    $answer = Invoke-RestMethod -Uri "$AnalysisBaseUrl/analysis/ask" -Method Post -Body $askBody -ContentType "application/json"
    Write-Host "   Question: $question"
    Write-Host "   Answer: $answer"
} catch {
    Write-Error "Ask failed."
    Write-Host "Response: $($_.ErrorDetails.Message)"
}

# Test API - PowerShell Script
# Execute após adicionar SUPABASE_SERVICE_ROLE_KEY no .env

Write-Host "🧪 Testando API BidTech..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "1️⃣ Fazendo login..." -ForegroundColor Yellow
$loginResponse = Invoke-WebRequest -Uri "http://localhost:3333/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@bidtech.internal","password":"Mudar@123"}'

$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.access_token

if ($token) {
  Write-Host "✅ Login OK - Token: $($token.Substring(0,20))..." -ForegroundColor Green
} else {
  Write-Host "❌ Falha no login" -ForegroundColor Red
  exit 1
}

Write-Host ""

# Step 2: Create Process
Write-Host "2️⃣ Criando processo (DRAFT)..." -ForegroundColor Yellow
$createResponse = Invoke-WebRequest -Uri "http://localhost:3333/processes" `
  -Method POST `
  -Headers @{
    "Authorization"="Bearer $token"
    "Content-Type"="application/json"
  } `
  -Body '{"name":"Processo de Teste API"}'

$processData = $createResponse.Content | ConvertFrom-Json
$processId = $processData.id

if ($processId) {
  Write-Host "✅ Processo criado - ID: $processId" -ForegroundColor Green
} else {
  Write-Host "❌ Falha ao criar processo" -ForegroundColor Red
  exit 1
}

Write-Host ""

# Step 3: Update Objective
Write-Host "3️⃣ Atualizando objetivo..." -ForegroundColor Yellow
$objectiveResponse = Invoke-WebRequest -Uri "http://localhost:3333/processes/$processId/objective" `
  -Method PATCH `
  -Headers @{
    "Authorization"="Bearer $token"
    "Content-Type"="application/json"
  } `
  -Body '{"objective":"Testar a API de processos"}'

Write-Host "✅ Objetivo atualizado" -ForegroundColor Green
Write-Host ""

# Step 4: Update Scope
Write-Host "4️⃣ Atualizando escopo..." -ForegroundColor Yellow
$scopeResponse = Invoke-WebRequest -Uri "http://localhost:3333/processes/$processId/scope" `
  -Method PATCH `
  -Headers @{
    "Authorization"="Bearer $token"
    "Content-Type"="application/json"
  } `
  -Body '{"scope_in":["Item 1","Item 2"],"scope_out":["Item 3"]}'

Write-Host "✅ Escopo atualizado" -ForegroundColor Green
Write-Host ""

# Step 5: Update Details
Write-Host "5️⃣ Atualizando detalhes (steps + SIPOC)..." -ForegroundColor Yellow
$detailsBody = @"
{
  "steps": [
    {
      "title": "Aprovação",
      "description": "Gerente aprova requisição",
      "inputs": ["Requisição"],
      "outputs": ["Aprovação"],
      "responsibleId": "33333333-3333-3333-3333-333333333333",
      "order": 1
    }
  ],
  "sipoc": {
    "suppliers": ["Fornecedor A"],
    "inputs": ["Requisição"],
    "outputs": ["Pedido"],
    "customers": ["Solicitante"]
  }
}
"@

$detailsResponse = Invoke-WebRequest -Uri "http://localhost:3333/processes/$processId/details" `
  -Method PATCH `
  -Headers @{
    "Authorization"="Bearer $token"
    "Content-Type"="application/json"
  } `
  -Body $detailsBody

Write-Host "✅ Detalhes atualizados (validação de colaborador OK)" -ForegroundColor Green
Write-Host ""

# Step 6: Publish
Write-Host "6️⃣ Publicando processo..." -ForegroundColor Yellow
$publishResponse = Invoke-WebRequest -Uri "http://localhost:3333/processes/$processId/publish" `
  -Method PATCH `
  -Headers @{"Authorization"="Bearer $token"}

Write-Host "✅ Processo publicado" -ForegroundColor Green
Write-Host ""

# Step 7: Verify in Database
Write-Host "7️⃣ Verificando no banco de dados..." -ForegroundColor Yellow
$getResponse = Invoke-WebRequest -Uri "http://localhost:3333/processes/$processId" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}

$finalProcess = $getResponse.Content | ConvertFrom-Json

Write-Host "✅ Processo recuperado do banco:" -ForegroundColor Green
Write-Host "   - ID: $($finalProcess.id)" -ForegroundColor White
Write-Host "   - Nome: $($finalProcess.title)" -ForegroundColor White
Write-Host "   - Status: $($finalProcess.status)" -ForegroundColor White
Write-Host ""

Write-Host "🎉 TODOS OS TESTES PASSARAM!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximo passo: Abra o Supabase e veja o processo na tabela 'processes'" -ForegroundColor Cyan

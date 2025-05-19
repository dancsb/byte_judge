# PowerShell script to build all necessary Docker images

# Set the paths to the Dockerfiles
$dockerfiles = @(
    "Backend/docker/bytejudge-c-runner",
    "Backend/docker/bytejudge-python-runner"
)

# Loop through each Dockerfile path and build the image
foreach ($path in $dockerfiles) {
    $imageName = Split-Path -Leaf $path
    Write-Host "Building Docker image: $imageName"
    docker build -t $imageName $path
}

#!/bin/bash
echo "Checking for EF Core migrations..."

# Check if any pending migrations exist
if dotnet ef migrations script --idempotent --output /dev/null; then
  echo "No new migrations detected."
else
  echo "Generating new migration..."
  TIMESTAMP=$(date +"%Y%m%d%H%M%S")
  dotnet ef migrations add AutoMigration_$TIMESTAMP
fi

# Apply migrations
echo "Applying database migrations..."
dotnet ef database update

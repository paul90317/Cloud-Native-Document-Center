#!/bin/sh

# Mount the GCS bucket
gcsfuse document-center-public-image-bucket /usr/src/app/static/public

# Start the application
exec npm start

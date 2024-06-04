docker build --platform linux/amd64 -t gcp-document-service .
# docker run -p 80:8080 gcp-document-service

# push to artifact registry
docker tag gcp-document-service us-docker.pkg.dev/cloud-native-418805/document-center/gcp-document-service
docker push us-docker.pkg.dev/cloud-native-418805/document-center/gcp-document-service
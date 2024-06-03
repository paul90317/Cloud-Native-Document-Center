docker build --platform linux/amd64 -t gcp-auth-service .
# docker run -p 80:8080 gcp-auth-service

# push to artifact registry
docker tag gcp-auth-service us-docker.pkg.dev/cloud-native-418805/document-center/gcp-auth-service
docker push us-docker.pkg.dev/cloud-native-418805/document-center/gcp-auth-service
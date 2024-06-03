docker build --platform linux/amd64 -t gcp-review-service .
# docker run -p 80:8080 gcp-review-service

# push to artifact registry
docker tag gcp-review-service us-docker.pkg.dev/cloud-native-418805/document-center/gcp-review-service
docker push us-docker.pkg.dev/cloud-native-418805/document-center/gcp-review-service
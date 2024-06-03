docker build --platform linux/amd64 -t gcp-image-service .
# docker run --cap-add SYS_ADMIN --device /dev/fuse -it -p 80:8080 gcp-image-service

# push to artifact registry
docker tag gcp-image-service us-docker.pkg.dev/cloud-native-418805/document-center/gcp-image-service
docker push us-docker.pkg.dev/cloud-native-418805/document-center/gcp-image-service
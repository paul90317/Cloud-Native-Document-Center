docker build --platform linux/amd64 -t gcp-frontend .
# docker run --cap-add SYS_ADMIN --device /dev/fuse -it -p 80:8080 gcp-frontend

# push to artifact registry
docker tag gcp-frontend us-docker.pkg.dev/cloud-native-418805/document-center/gcp-frontend
docker push us-docker.pkg.dev/cloud-native-418805/document-center/gcp-frontend
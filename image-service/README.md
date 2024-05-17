# Image Service
Image service. Providing CRUD method of images.

## Usage

### setup
```sh
cp .env.sample .env

// edit the .env file if needed
```

### docker
```sh
docker build -t image-service .
docker run -p 8082:8082 --name image-service image-service
```
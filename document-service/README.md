# Document Service
Document service. Providing CRUD method of docs.

## Usage

### setup
```sh
cp .env.sample .env

// edit the .env file if needed
```

### docker
```sh
docker build -t document-service .
docker run -p 8081:8081 --name document-service document-service
```

### API document
http://localhost:8081/api-docs/
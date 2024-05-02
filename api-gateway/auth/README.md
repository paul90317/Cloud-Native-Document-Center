# Auth Service
Use google OAuth2.0 to prvide a basic third party login.
Providing JWT authentication.

## Usage

### docker
```
docker build -t auth .
docker run -p 8080:8080 --name auth auth
```
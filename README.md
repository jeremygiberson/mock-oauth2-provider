# Dockerized @loopback-next/mock-oauth2-provider
This fork dockerizes the mockoauth2-provider and makes the test users configurable via a yaml file that can be mounted 
from the host OS. 

This repo was forked w/ `git subtree` so that updates to the upstream package can be pulled in easily.
More about that process [here](https://stackoverflow.com/questions/24577084/forking-a-sub-directory-of-a-repository-on-github-and-making-it-part-of-my-own-r).

## Getting Started
You just need to spin up a container with this image and you've got a working mock oauth server.
See [docker-compose.yml](docker-compose.yml) for an demonstration.

Note, the service `volumes` section in the sample `docker-compose.yml`, this is how to configure the available users in the mock server.
See [data/config.yml](data/config.yml) for a configuration example.

Once the container is running, you simply just need to point your project to it.
Most OpenID clients/libraries support configuration via a `.well-known` configuration url, this
mock servers `.well-known` configuration is at `http://localhost:9000/oauth/.well-known/openid-configuration`

## Configuration
In `config.yml` you'll find the issuer, users and apps for the mock server.
If you don't override the config w/ the volume mount, you can simply use the values in `config.yml` for your testing.
Otherwise, you'll need to supply all the clients and users you need for your testing.

## Final Notes
Keep in mind, this is a bare bones oauth server. If you need more robust or polished functionality, I recommend you use
an actual identity provider that can run locally (like [keycloak](https://www.keycloak.org/)).  

# mock-oauth2-provider
This package provides an app which mocks the OAuth2 authorization flow login
with a social app like facebook, google, etc

- Endpoints :
  - `/oauth/dialog` - opens the oauth2 flow, redirects to login page
  - `/login` - loads the login page
  - `/login_submit` - submit username , password
  - `/oauth/token` - returns a token in exchange for a valid authorization code
  - `/verify` - verifies token

With the above endpoints, this mock can be used for tests to attain below oauth2
stages

- stage 1 : Authorization code grant - Get access code
  - [1] invoke oauth2 dialog end point `/oauth/dialog` with callback url
  - [2] redirects to mock auth server login page `/login`
  - [3] successful login with mock server redirects to callback url with access
    code
- stage 2 : Authentication - Exchange access code for access token
  - [4] invoke with access code, `/oauth/token` to get access token
  - [5] auth server returns access token, `/verify` can be used to verify access
    token and get user profile

```
+---------------+                               +--------------+
|               | <---------[1]-------------    | Application  |
| Mock          | Application sends request     |  ^           |
| Authorization | to auth server,payload:       |  |           |
| Server        | {'client_id':,                |  |           |
| (mock-oauth2- |     'callback_url': app url } |  Stage 1     |
| social-app.ts)|                               |  |           |
|               |----+ auth server redirects    |  |           |
|               |    | browser to login page,   |  |           |
|               |  [2] client_id and            |  |           |
|               |    | callback_url are         |  |           |
|               |<---+ passed as hidden params  |  |           |
|               |                               |  |           |
|               |                               |  v           |
|               | -------[3]------------->      | ***          |
|               | login success, auth server    |  ^           |
|               | redirects browser to callback |  |           |
|               | url with access_code          |  |           |
|               |                               |  |           |
|               | <-------------[4]---------    |  |           |
|               |  Application requests access  |  Stage 2     |
|               |  token with access_code       |  |           |
|               |                               |  |           |
|               | ---------------[5]--------->  |  v           |
+---------------+       returns access token    +--------------+

```

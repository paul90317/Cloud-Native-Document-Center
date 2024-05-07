# AUTH API SPEC
Hostname in Docker Compose: `http://auth`
## GET /
給予測試用的登入畫面，用來人工測試 auth 微服務的各種功能
### Response
Status Code: 200 OK
|Body (HTML)|
|-|
|登入畫面|
***
## GET /google/login
用來第三方登入用的，**會希望可以透過反向代理直接和瀏覽器互動**。經過預處裡後會重導向到 gmail 選擇畫面 `https://accounts.google.com/o/oauth2/v2/auth?...`，接著重導向到 `http://localhost/google/login/callback?code=...`，反向代理到 `http://auth/google/login/callback?code=...`。

以下只定義重導向之前的行為。

### Response
成功: 302 Found
|Headers||
|-|-|
|Location|`https://accounts.google.com/o/oauth2/v2/auth?...`|
***
## GET /google/login/callback
**這是專門讓 google 帳戶選擇畫面 (瀏覽器端) 重導向的，需要被反向代理**。google 會附帶一次性密碼參數，可用該一次性密碼參數再向 google 換到選擇的 email，確認 email 在資料庫存在時會成功，給予 JWT 憑證並回傳 200，否則回傳 401。
### Request
|Query||
|-|-|
|code|<一次性密碼>|


### Response

成功: 200 OK
|Headers||
|-|-|
|Set-Cookie|token=<JWT 憑證>|

失敗: 401 Unauthorized

***
## GET /google/bind
用來在登入狀態 (也就是有 JWT 憑證) 綁定帳戶用的，**會希望可以透過反向代理直接和瀏覽器互動**。經過預處裡後會重導向到 gmail 選擇畫面 `https://accounts.google.com/o/oauth2/v2/auth?...`，接著重導向到 `http://localhost/google/bind/callback?code=...`，反向代理到 `http://auth/google/bind/callback?code=...`。

以下只定義重導向之前的行為。
### Response
成功: 302 Found
|Headers||
|-|-|
|Location|`https://accounts.google.com/o/oauth2/v2/auth?...`|
***
## GET /google/bind/callback
**這是專門讓 google 帳戶選擇畫面 (瀏覽器端) 重導向的，需要被反向代理**。google 會附帶一次性密碼參數，可用該一次性密碼參數再向 google 換到選擇的 email，若驗證失敗回傳 401，gmail 已存在回傳 400，否則回傳 200，並綁定 gmail。
### Request
|Query||
|-|-|
|code|<一次性密碼>|

|Headers||
|-|-|
|Cookie|token=<JWT 憑證>|

### Response

驗證失敗: 401 Unauthorized

gmail 已經存在: 400 Bad Request

成功: 200 OK

***

## POST /local/login
登入帳號，當給定帳號存在並且密碼相同就會成功，成功會給予憑證 JWT
### Request
|Body (JSON)||
|-|-|
|account|<帳號>|
|passwd|<密碼雜湊>|

### Response
成功: 200 OK

|Headers||
|-|-|
|Set-Cookie|token=<JWT 憑證>|

失敗: 401 Unauthorized

***
## POST /local/register
呼叫端給予帳號和密碼雜湊以註冊新帳號，當帳號不重複就會註冊成功。
### Request
|Body (JSON)||
|-|-|
|account|<帳號>|
|passwd|<密碼雜湊>|
### Response
成功: 200 OK

失敗: 400 Bad Request
***
## GET /auth
當 cookie 中的 token 挾帶的 JWT 驗證成功的話會回傳其 json 內容，也是帳號名稱，否則不會回傳狀態碼 401。

該 API 不會驗證使用者是否存在資料庫。

### Request
|Headers||
|-|-|
|Cookie|token=<JWT 憑證>|

### Response
成功: 200 OK

|Body (JSON)||
|-|-|
|account|<帳號>|

失敗: 401 Unauthorized
SET @account = ?, @document = ?;

select
  creator from documents where id = @document
into @creator;

select
  manager from users where account = @account
into @manager;

select
  CASE
    when @creator is null then 404
    WHEN @account = @creator THEN 200
    when @manager = 1 then 200
    ELSE 403
  END
into @status_code;


update documents set reviewer = @creator, status = 0, message = '' where id = @document and @status_code = 200;

SELECT @status_code AS status_code;
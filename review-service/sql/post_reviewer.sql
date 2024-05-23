SET @account = ?, @document = ?, @reviewer = ?;

select
  creator, status from documents where id = @document
into @creator, @status;

select
  manager from users where account = @account
into @manager;

select
  CASE
    when @creator is null then 4041
    when not exists(select * from users where account = @reviewer) then 4042
    when @status != 0 then 4091
    when @reviewer = @creator then 4092
    when exists(select * from roles where user = @reviewer and document = @document and role = 1) then 4092
    WHEN @account = @creator THEN 200
    when @manager = 1 then 200
    ELSE 403
  END
into @status_code;


update documents set reviewer = @reviewer, status = 1, message = '' where id = @document and @status_code = 200;

SELECT @status_code AS status_code;
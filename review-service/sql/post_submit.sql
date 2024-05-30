SET @account = ?, @document = ?, @reviewer = ?, @message = ?;

select
  creator, status from documents where id = @document
into @creator, @status;

select
  manager from users where account = @account
into @manager;

select
  CASE
    when not exists(select 1 from documents where id = @document) then 4041
    when not exists(select 1 from users where account = @reviewer) then 4042
    when @status != 0 then 4091
    when @reviewer = @creator then 4092
    when exists(select 1 from roles where user = @reviewer and document = @document) then 4092
    WHEN @account = @creator THEN 200
    when @manager = 1 then 200
    ELSE 403
  END
into @status_code;

insert into roles (document, user, role) 
  select @document, @reviewer, 2 where @status_code = 200;
update documents set reviewer = @reviewer, status = 1, message = @message where id = @document and @status_code = 200;

insert into logs (document, type, ufrom, uto, message)
  select @document, 4, @account, @reviewer, @message where @status_code = 200;

SELECT @status_code AS status_code;
SET @account = ?, @document = ?;

select
  creator from documents where id = @document
into @creator;

select
  manager from users where account = @account
into @manager;

select
  CASE
    when not exists(select 1 from documents where id = @document) then 404
    when not exists(select 1 from documents where id = @document and status != 0) then 409
    WHEN @account = @creator THEN 200
    when @manager = 1 then 200
    ELSE 403
  END
into @status_code;

select reviewer into @reviewer from documents where id = @document;
delete from roles where user = @reviewer and document = @document and @status_code = 200;

update documents set reviewer = @creator, status = 0, message = null where id = @document and @status_code = 200;

insert into logs (document, type, ufrom)
  select @document, 4, @account where @status_code = 200;

SELECT @status_code AS status_code;
SET @account = ?, @document = ?;

select
  reviewer, status from documents where id = @document
into @reviewer, @status;

select
  CASE
    when not exists(select 1 from documents where id = @document) then 404
    when @status = 0 then 4091
    when @status = 2 or @status = 3 then 4092
    WHEN @account = @reviewer THEN 200
    ELSE 403
  END
into @status_code;

update documents set status = 3, message = null where id = @document and @status_code = 200;

insert into logs (document, type, ufrom)
  select @document, 3, @account where @status_code = 200;

SELECT @status_code AS status_code;
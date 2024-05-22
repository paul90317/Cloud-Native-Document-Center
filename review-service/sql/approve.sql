SET @account = ?, @document = ?;

select
  reviewer, status from documents where id = @document
into @reviewer, @status;

select
  CASE
    when @reviewer is null then 404
    when @status = 0 then 4091
    when @status = 2 or @status = 3 then 4092
    WHEN @account = @reviewer THEN 200
    ELSE 403
  END
into @status_code;

update documents set status = 3, message = '' where id = @document and @status_code = 200;

SELECT @status_code AS status_code;
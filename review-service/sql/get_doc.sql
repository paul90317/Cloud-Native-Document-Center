SET @account = ?, @document = ?, @reviewer;

select
  creator from documents where id = @document
into @creator;

select
  manager from users where account = @account
into @manager;

select
  CASE
    WHEN @account = @creator THEN 200
    when @manager = 1 then 200
    ELSE 403
  END
into @status_code;

SELECT 
    *,
    @status_code AS status_code 
FROM 
    documents 
WHERE 
    id = @document;
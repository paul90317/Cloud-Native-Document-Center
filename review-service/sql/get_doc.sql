SET @account = ?, @document = ?;

select
  creator, reviewer from documents where id = @document
into @creator, @reviewer;

select
  CASE
    when exists(select * from roles where user = @account and document = @account) then 200
    WHEN @account = @creator THEN 200
    when @account = @reviewer then 200
    when (select manager from users where account = @account) = 1 then 200
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
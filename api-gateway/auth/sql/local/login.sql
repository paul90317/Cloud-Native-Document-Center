SET @account = ?, @passwd = ?;

SELECT 
  CASE 
    WHEN EXISTS (SELECT * FROM users WHERE account = @account AND passwd = @passwd) THEN 200
    WHEN EXISTS (SELECT * FROM users WHERE account = @account) THEN 401
    ELSE 404
  END 
into @status_code;

select @status_code as status_code;

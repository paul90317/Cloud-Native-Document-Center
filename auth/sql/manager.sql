SET @account = ?, @target = ?;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM users WHERE account = @account AND manager = 0) THEN 403
    WHEN EXISTS (SELECT 1 FROM users WHERE account = @target) THEN 200
    ELSE 404
  END 
into @status_code;

update users set manager = 1 where account = @target and @status_code = 200;

select @status_code as status_code;

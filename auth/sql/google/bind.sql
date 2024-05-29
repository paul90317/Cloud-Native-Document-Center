SET @account = ?, @email = ?;

select
  CASE
    WHEN EXISTS (SELECT 1 FROM users WHERE email = @EMAIL) THEN 409
    ELSE 200 
  END
into @status_code;

update users set email = @email where account = @account and @status_code = 200;

select @status_code as status_code;

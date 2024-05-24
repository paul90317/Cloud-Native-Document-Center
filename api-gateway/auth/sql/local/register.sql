SET @account = ?, @passwd = ?;

select
  CASE 
    WHEN EXISTS (SELECT 1 FROM users WHERE account = @account) THEN 409
    ELSE 200
  END
into @status_code;

insert into users(account, passwd)
  select @account, @passwd where @status_code = 200;

select @status_code as status_code;

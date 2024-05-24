SET @account = ?, @passwd = ?, @email = ?, @name = ?, @phone = ?, @profile = ?;

select
  CASE 
    WHEN EXISTS (SELECT * FROM users WHERE account = @account) THEN 409
    ELSE 200
  END
into @status_code;

insert into users(account, passwd ,email , name , phone , profile)
  select @account, @passwd, @email, @name, @phone, @profile where @status_code = 200;

select @status_code as status_code;
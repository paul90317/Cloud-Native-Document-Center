SET @caller = ?, @document = ?, @type = ?;

select * from logs
where 
  (@document is null or document = @document) and 
  (@type is null or type = @type) and 
  (
    (select manager from users where account = @caller) = 1 or 
    (select 1 from documents where id = logs.document and (reviewer = @caller or creator = @caller)) or 
    exists(select 1 from roles where document = logs.document and user = @caller)
  );
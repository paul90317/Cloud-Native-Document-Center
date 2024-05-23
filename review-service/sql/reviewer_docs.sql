set @caller = ?, @reviewer = ?;

select
  case
    when @caller = @reviewer then 200
    when (select manager from users where account = @caller) = 1 then 200
    else 403
  end
into @status_code;

select *,
  @status_code as status_code
from documents where reviewer = @reviewer and status != 0;
namespace Portfolio.Domain.Common;

public class NotFoundException : Exception
{
    public string EntityName { get; }
    public object Key { get; }

    public NotFoundException(string message, string entityName, object key)
        : base(message)
    {
        EntityName = entityName;
        Key = key;
    }
}

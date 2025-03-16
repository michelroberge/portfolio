namespace Portfolio.Domain.Common;

public class DuplicateSlugException : Exception
{
    public DuplicateSlugException(string message) : base(message)
    {
    }
}

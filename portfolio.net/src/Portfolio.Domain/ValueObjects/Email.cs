using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;
using System.Text.RegularExpressions;

namespace Portfolio.Domain.ValueObjects;

public class Email : ValueObject
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new DomainValidationException("Email cannot be empty");

        email = email.Trim();

        if (email.Length > 256)
            throw new DomainValidationException("Email cannot be longer than 256 characters");

        if (!IsValidEmail(email))
            throw new DomainValidationException("Invalid email format");

        return new Email(email.ToLowerInvariant());
    }

    private static bool IsValidEmail(string email)
    {
        // Basic email validation using regex
        var pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        return Regex.IsMatch(email, pattern);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;
}

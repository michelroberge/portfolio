using FluentValidation.Results;

namespace Portfolio.Application.Common.Exceptions;

/// <summary>
/// Exception thrown when validation fails in the application layer.
/// Part of the Application layer's error handling following Clean Architecture principles.
/// Used by ValidationBehavior and domain validation to ensure consistent error handling.
/// </summary>
public class ValidationException : Exception
{
    /// <summary>
    /// Creates a new validation exception with a default message
    /// </summary>
    public ValidationException()
        : base("One or more validation failures have occurred.")
    {
        Errors = new Dictionary<string, string[]>();
    }

    /// <summary>
    /// Creates a new validation exception with a specific message
    /// </summary>
    /// <param name="message">The error message</param>
    public ValidationException(string message)
        : base(message)
    {
        Errors = new Dictionary<string, string[]>
        {
            { "Error", new[] { message } }
        };
    }

    /// <summary>
    /// Creates a new validation exception from FluentValidation failures
    /// </summary>
    /// <param name="failures">Collection of validation failures from FluentValidation</param>
    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }

    /// <summary>
    /// Dictionary of validation errors where the key is the property name
    /// and the value is an array of error messages
    /// </summary>
    public IDictionary<string, string[]> Errors { get; }
}

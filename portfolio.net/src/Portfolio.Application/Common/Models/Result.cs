namespace Portfolio.Application.Common.Models;

/// <summary>
/// Represents a result from a business operation
/// </summary>
public class Result<T>
{
    private Result(bool succeeded, T? data, IEnumerable<string> errors)
    {
        Succeeded = succeeded;
        Data = data;
        Errors = errors.ToArray();
    }

    public bool Succeeded { get; }
    public T? Data { get; }
    public string[] Errors { get; }

    public static Result<T> Success(T data) => new(true, data, Array.Empty<string>());
    public static Result<T> Failure(IEnumerable<string> errors) => new(false, default, errors);
    public static Result<T> Failure(string error) => new(false, default, new[] { error });
}

public class Result
{
    protected Result(bool succeeded, IEnumerable<string> errors)
    {
        Succeeded = succeeded;
        Errors = errors.ToArray();
    }

    public bool Succeeded { get; }
    public string[] Errors { get; }

    public static Result Success() => new(true, Array.Empty<string>());
    public static Result Failure(IEnumerable<string> errors) => new(false, errors);
    public static Result Failure(string error) => new(false, new[] { error });
}

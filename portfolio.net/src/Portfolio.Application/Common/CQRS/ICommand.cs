using MediatR;

namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Base interface for commands in CQRS pattern
/// </summary>
public interface ICommand : IRequest
{
}

/// <summary>
/// Base interface for commands that return a result in CQRS pattern
/// </summary>
public interface ICommand<TResult> : IRequest<TResult>
{
}

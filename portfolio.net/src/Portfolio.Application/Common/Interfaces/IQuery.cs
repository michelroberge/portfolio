using MediatR;

namespace Portfolio.Application.Common.Interfaces;

/// <summary>
/// Base interface for queries in CQRS pattern
/// </summary>
public interface IQuery<TResult> : IRequest<TResult>
{
}

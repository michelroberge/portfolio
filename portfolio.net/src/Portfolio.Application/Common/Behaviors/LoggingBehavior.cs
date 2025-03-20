using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Portfolio.Application.Common.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var requestId = Guid.NewGuid().ToString();

        _logger.LogInformation(
            "Beginning request {RequestName} [{RequestId}]",
            requestName,
            requestId);

        var timer = Stopwatch.StartNew();

        try
        {
            var response = await next();
            timer.Stop();

            _logger.LogInformation(
                "Completed request {RequestName} [{RequestId}] in {ElapsedMilliseconds}ms",
                requestName,
                requestId,
                timer.ElapsedMilliseconds);

            return response;
        }
        catch (Exception ex)
        {
            timer.Stop();

            _logger.LogError(
                ex,
                "Request {RequestName} [{RequestId}] failed after {ElapsedMilliseconds}ms",
                requestName,
                requestId,
                timer.ElapsedMilliseconds);

            throw;
        }
    }
}

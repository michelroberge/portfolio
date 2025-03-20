namespace Portfolio.Application.Interfaces.Services;

/// <summary>
/// Interface for AI operations using Ollama
/// </summary>
public interface IAiService
{
    Task<float[]> GenerateEmbeddingsAsync(string text, CancellationToken cancellationToken = default);
    Task<string> GenerateSummaryAsync(string text, CancellationToken cancellationToken = default);
    Task<string> GenerateExcerptAsync(string text, int maxLength = 500, CancellationToken cancellationToken = default);
    Task<IEnumerable<string>> GenerateTagsAsync(string text, int maxTags = 5, CancellationToken cancellationToken = default);
}

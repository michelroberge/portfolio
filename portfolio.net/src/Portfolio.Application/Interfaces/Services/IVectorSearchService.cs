namespace Portfolio.Application.Interfaces.Services;

/// <summary>
/// Interface for vector search operations using Qdrant
/// </summary>
public interface IVectorSearchService
{
    Task<int> GetNextVectorIdAsync(string collectionName, CancellationToken cancellationToken = default);
    Task UpsertVectorAsync(string collectionName, int vectorId, float[] vector, Dictionary<string, object> payload, CancellationToken cancellationToken = default);
    Task DeleteVectorAsync(string collectionName, int vectorId, CancellationToken cancellationToken = default);
    Task<IEnumerable<(int VectorId, float Score, Dictionary<string, object> Payload)>> SearchAsync(
        string collectionName,
        float[] queryVector,
        int limit = 10,
        float scoreThreshold = 0.7f,
        CancellationToken cancellationToken = default);
}

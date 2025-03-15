namespace Portfolio.Application.Interfaces.Services;

/// <summary>
/// Interface for file storage operations
/// </summary>
public interface IFileStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<Stream> GetFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<bool> FileExistsAsync(string fileUrl, CancellationToken cancellationToken = default);
    string GetPublicUrl(string fileUrl);
}

using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Interfaces;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Domain.Entities;

public class User : Entity, IUser
{
    public string Username { get; private set; }
    public Email Email { get; private set; }
    public string? DisplayName { get; private set; }
    public string? AvatarUrl { get; private set; }
    public string? Provider { get; private set; }
    public string? ProviderId { get; private set; }
    public bool IsAdmin { get; private set; }

    // For ORM
    private User() : base()
    {
        Username = string.Empty;
        Email = Email.Create("placeholder@example.com"); // Will be overwritten by ORM
    }

    public User(
        string id,
        string username,
        Email email,
        string? displayName = null,
        string? avatarUrl = null,
        string? provider = null,
        string? providerId = null,
        bool isAdmin = false) : base(id)
    {
        ValidateUsername(username);
        ValidateUrl(avatarUrl, nameof(avatarUrl));
        ValidateProviderInfo(provider, providerId);

        Username = username;
        Email = email;
        DisplayName = displayName;
        AvatarUrl = avatarUrl;
        Provider = provider;
        ProviderId = providerId;
        IsAdmin = isAdmin;
    }

    public void UpdateDisplayName(string? displayName)
    {
        if (displayName?.Length > 100)
            throw new DomainValidationException("Display name cannot be longer than 100 characters");

        DisplayName = displayName;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateAvatarUrl(string? avatarUrl)
    {
        ValidateUrl(avatarUrl, nameof(avatarUrl));
        AvatarUrl = avatarUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateProvider(string? provider, string? providerId)
    {
        ValidateProviderInfo(provider, providerId);
        Provider = provider;
        ProviderId = providerId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetAdminStatus(bool isAdmin)
    {
        IsAdmin = isAdmin;
        UpdatedAt = DateTime.UtcNow;
    }

    private static void ValidateUsername(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new DomainValidationException("Username cannot be empty");

        if (username.Length < 3)
            throw new DomainValidationException("Username must be at least 3 characters long");

        if (username.Length > 50)
            throw new DomainValidationException("Username cannot be longer than 50 characters");

        // Username can only contain letters, numbers, dots, and underscores
        if (!System.Text.RegularExpressions.Regex.IsMatch(username, @"^[a-zA-Z0-9._]+$"))
            throw new DomainValidationException("Username can only contain letters, numbers, dots, and underscores");
    }

    private static void ValidateUrl(string? url, string paramName)
    {
        if (string.IsNullOrWhiteSpace(url))
            return;

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uriResult) || 
            (uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps))
        {
            throw new DomainValidationException($"{paramName} must be a valid HTTP/HTTPS URL");
        }
    }

    private static void ValidateProviderInfo(string? provider, string? providerId)
    {
        if ((provider == null) != (providerId == null))
            throw new DomainValidationException("Provider and ProviderId must both be either null or non-null");

        if (provider != null)
        {
            if (string.IsNullOrWhiteSpace(provider))
                throw new DomainValidationException("Provider cannot be empty when specified");

            if (string.IsNullOrWhiteSpace(providerId))
                throw new DomainValidationException("ProviderId cannot be empty when provider is specified");
        }
    }
}

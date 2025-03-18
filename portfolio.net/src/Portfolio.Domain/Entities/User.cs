using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.ValueObjects;

namespace Portfolio.Domain.Entities;

public class User : Entity
{
    private string _username = string.Empty;
    public string Username
    {
        get => _username;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainValidationException("Username cannot be empty");
            if (value.Length < 3)
                throw new DomainValidationException("Username must be at least 3 characters long");
            if (value.Length > 50)
                throw new DomainValidationException("Username cannot be longer than 50 characters");
            if (!System.Text.RegularExpressions.Regex.IsMatch(value, @"^[a-zA-Z0-9._]+$"))
                throw new DomainValidationException("Username can only contain letters, numbers, dots, and underscores");
            _username = value;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private string? _displayName;
    public string? DisplayName
    {
        get => _displayName;
        set
        {
            if (value?.Length > 100)
                throw new DomainValidationException("Display name cannot be longer than 100 characters");
            _displayName = value;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private string? _avatarUrl;
    public string? AvatarUrl
    {
        get => _avatarUrl;
        set
        {
            ValidateUrl(value, nameof(AvatarUrl));
            _avatarUrl = value;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public Email Email { get; set; }
    public bool IsAdmin { get; set; }

    // For ORM
    private User() : base()
    {
        Email = Email.Create("placeholder@example.com"); // Will be overwritten by ORM
    }

    public User(
        string id,
        string username,
        Email email,
        string? displayName = null,
        string? avatarUrl = null,
        bool isAdmin = false) : base(id)
    {
        Username = username;
        Email = email;
        DisplayName = displayName;
        AvatarUrl = avatarUrl;
        IsAdmin = isAdmin;
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
}
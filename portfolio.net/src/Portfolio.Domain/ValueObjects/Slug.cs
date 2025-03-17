using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Portfolio.Domain.Common;
using Portfolio.Domain.Exceptions;

namespace Portfolio.Domain.ValueObjects
{
    public class Slug : ValueObject
    {
        public string Value { get; }

        private Slug(string value)
        {
            Value = value;
        }
        public static Slug Create(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new DomainValidationException("Title cannot be empty");

            title = GenerateSlug(title);

            if (title.Length > 256)
                throw new DomainValidationException("Title cannot be longer than 256 characters");

            return new Slug(title.ToLowerInvariant());
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

        private static string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return string.Empty;

            // Convert to lower case
            title = title.ToLowerInvariant();

            // Normalize to remove diacritics (accents)
            title = RemoveDiacritics(title);

            // Remove invalid characters
            title = Regex.Replace(title, @"[^a-z0-9\s-]", "");

            // Replace multiple spaces with a single space
            title = Regex.Replace(title, @"\s+", " ").Trim();

            // Replace spaces with dashes
            title = Regex.Replace(title, @"\s", "-");

            return title;
        }

        private static string RemoveDiacritics(string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
        public override string ToString() => Value;
    }
}

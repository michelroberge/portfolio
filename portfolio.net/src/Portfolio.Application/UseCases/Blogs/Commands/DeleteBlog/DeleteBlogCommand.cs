using MediatR;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Blogs.Commands.DeleteBlog;

public record DeleteBlogCommand(string Id) : ICommand<Unit>;

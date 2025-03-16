using AutoMapper;
using Portfolio.Application.Common.DTOs;
using Portfolio.Application.Common.Exceptions;
using Portfolio.Application.Common.Interfaces;

namespace Portfolio.Application.UseCases.Users.Queries.GetUserById;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public GetUserByIdQueryHandler(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"User with ID {request.Id} not found");

        return _mapper.Map<UserDto>(user);
    }
}

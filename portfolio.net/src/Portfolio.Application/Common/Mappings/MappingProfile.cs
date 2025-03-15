using AutoMapper;
using Portfolio.Application.Common.DTOs;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Blog, BlogDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));

        CreateMap<Project, ProjectDto>()
            .ForMember(dest => dest.Technologies, opt => opt.MapFrom(src => src.Technologies));

        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email.Value));
    }
}

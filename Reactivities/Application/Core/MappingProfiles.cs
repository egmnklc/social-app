using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //*  Automapper will take a look at the LHS Activity class, it will compare the attributes 
            //* of the Acitivity class with RHS activity and check if they match.  
            CreateMap<Activity, Activity>();
        }
    }
}
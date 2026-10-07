using Microsoft.AspNetCore.Identity;

namespace GraduacionWeb.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Nombre { get; set; } = string.Empty;
    }
}
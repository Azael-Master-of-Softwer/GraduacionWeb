using System.ComponentModel.DataAnnotations;

namespace GraduacionWeb.API.DTOs
{
    public class RegistroDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string CodigoRegistro { get; set; } = string.Empty;
    }
}
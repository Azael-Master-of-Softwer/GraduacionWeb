using System.ComponentModel.DataAnnotations;

namespace GraduacionWeb.API.DTOs
{
    public class AvisoCrearDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [StringLength(2000, MinimumLength = 3)]
        public string Mensaje { get; set; } = string.Empty;
    }

    public class AvisoEditarDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [StringLength(2000, MinimumLength = 3)]
        public string Mensaje { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(ACTIVO|INACTIVO)$",
            ErrorMessage = "El estado debe ser ACTIVO o INACTIVO.")]
        public string Estado { get; set; } = string.Empty;
    }
}
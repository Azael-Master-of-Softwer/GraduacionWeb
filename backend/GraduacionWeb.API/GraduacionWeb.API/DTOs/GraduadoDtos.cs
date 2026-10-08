using System.ComponentModel.DataAnnotations;

namespace GraduacionWeb.API.DTOs
{
    public class GraduadoCrearDto
    {
        [Required]
        [StringLength(50)]
        public string Identificador { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.01", "1000000",
            ParseLimitsInInvariantCulture = true,
            ConvertValueInInvariantCulture = true,
            ErrorMessage = "El total debe ser mayor a 0.")]
        public decimal TotalGraduacion { get; set; }
    }
}
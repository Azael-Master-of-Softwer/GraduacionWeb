using System.ComponentModel.DataAnnotations;

namespace GraduacionWeb.API.DTOs
{
    public class ConfiguracionActualizarDto
    {
        public DateTime? FechaGraduacion { get; set; }

        [Range(typeof(decimal), "0.01", "1000000",
            ParseLimitsInInvariantCulture = true,
            ConvertValueInInvariantCulture = true,
            ErrorMessage = "La meta por alumno debe ser mayor a 0.")]
        public decimal? MetaPorAlumno { get; set; }
    }
}
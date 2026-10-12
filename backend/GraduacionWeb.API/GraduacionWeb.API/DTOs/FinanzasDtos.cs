using System.ComponentModel.DataAnnotations;

namespace GraduacionWeb.API.DTOs
{
    public class ActividadCrearDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(500)]
        public string Descripcion { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.01", "10000000",
            ParseLimitsInInvariantCulture = true,
            ConvertValueInInvariantCulture = true,
            ErrorMessage = "La meta debe ser mayor a 0.")]
        public decimal? Meta { get; set; }

        public DateTime? Fecha { get; set; }
    }

    public class ActividadEditarDto : ActividadCrearDto
    {
        [Required]
        [RegularExpression("^(ACTIVA|TERMINADA)$",
            ErrorMessage = "El estado debe ser ACTIVA o TERMINADA.")]
        public string Estado { get; set; } = string.Empty;
    }

    public class MovimientoCrearDto
    {
        [Required]
        [RegularExpression("^(INGRESO|EGRESO)$",
            ErrorMessage = "El tipo debe ser INGRESO o EGRESO.")]
        public string Tipo { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.01", "10000000",
            ParseLimitsInInvariantCulture = true,
            ConvertValueInInvariantCulture = true,
            ErrorMessage = "El monto debe ser mayor a 0.")]
        public decimal Monto { get; set; }

        [Required]
        public DateTime? Fecha { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 3)]
        public string Concepto { get; set; } = string.Empty;

        public int? ActividadId { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace GraduacionWeb.API.DTOs
{
    public class EventoCrearDto
    {
        [Required]
        public DateTime? Fecha { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(PAGO|REUNION|EVENTO|OTRO)$",
            ErrorMessage = "El tipo debe ser PAGO, REUNION, EVENTO u OTRO.")]
        public string Tipo { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Descripcion { get; set; } = string.Empty;
    }

    public class EventoEditarDto : EventoCrearDto
    {
        [Required]
        [RegularExpression("^(PENDIENTE|COMPLETADO|CANCELADO)$",
            ErrorMessage = "El estado debe ser PENDIENTE, COMPLETADO o CANCELADO.")]
        public string Estado { get; set; } = string.Empty;
    }
}
using System.ComponentModel.DataAnnotations;

namespace GraduacionWeb.API.DTOs
{
    public class PagoCrearDto
    {
        [Required]
        public int GraduadoId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Monto { get; set; }

        [Required]
        public string Concepto { get; set; } = string.Empty;
    }
}
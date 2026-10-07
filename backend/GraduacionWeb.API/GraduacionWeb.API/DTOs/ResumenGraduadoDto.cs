namespace GraduacionWeb.API.DTOs
{
    public class ResumenGraduadoDto
    {
        public string Identificador { get; set; } = string.Empty;

        public decimal TotalGraduacion { get; set; }

        public decimal TotalPagado { get; set; }

        public decimal Pendiente { get; set; }

        public List<PagoResumenDto> Pagos { get; set; } = new();
    }

    public class PagoResumenDto
    {
        public DateTime Fecha { get; set; }

        public decimal Monto { get; set; }

        public string Concepto { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;
    }
}
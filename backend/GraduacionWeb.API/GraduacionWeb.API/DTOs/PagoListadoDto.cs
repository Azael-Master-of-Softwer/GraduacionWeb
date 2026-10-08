namespace GraduacionWeb.API.DTOs
{
    public class PagoListadoDto
    {
        public int Id { get; set; }
        public int GraduadoId { get; set; }
        public string Identificador { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }
        public string Concepto { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
    }
}
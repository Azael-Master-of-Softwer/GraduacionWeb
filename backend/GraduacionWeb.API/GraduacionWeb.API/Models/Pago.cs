namespace GraduacionWeb.API.Models
{
    public class Pago
    {
        public int Id { get; set; }

        public int GraduadoId { get; set; }

        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }

        public string Concepto { get; set; } = string.Empty;

        public string Estado { get; set; } = "PENDIENTE";

        public Graduado? Graduado { get; set; }
    }
}
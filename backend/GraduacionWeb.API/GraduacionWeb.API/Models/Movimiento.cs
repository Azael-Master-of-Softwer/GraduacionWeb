namespace GraduacionWeb.API.Models
{
    public class Movimiento
    {
        public int Id { get; set; }

        // INGRESO (de una actividad) o EGRESO (gasto)
        public string Tipo { get; set; } = string.Empty;

        public decimal Monto { get; set; }

        public DateTime Fecha { get; set; }

        public string Concepto { get; set; } = string.Empty;

        public int? ActividadId { get; set; }

        public Actividad? Actividad { get; set; }

        public string RegistradoPor { get; set; } = string.Empty;
    }
}
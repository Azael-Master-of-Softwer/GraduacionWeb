namespace GraduacionWeb.API.Models
{
    public class Actividad
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public decimal? Meta { get; set; }

        public DateTime? Fecha { get; set; }

        public string Estado { get; set; } = "ACTIVA";
    }
}
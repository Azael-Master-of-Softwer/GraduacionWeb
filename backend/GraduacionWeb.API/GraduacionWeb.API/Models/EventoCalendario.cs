namespace GraduacionWeb.API.Models
{
    public class EventoCalendario
    {
        public int Id { get; set; }

        public DateTime Fecha { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string Tipo { get; set; } = "OTRO";

        public string Descripcion { get; set; } = string.Empty;

        public string Estado { get; set; } = "PENDIENTE";
    }
}
namespace GraduacionWeb.API.Models
{
    public class Aviso
    {
        public int Id { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string Mensaje { get; set; } = string.Empty;

        public DateTime Fecha { get; set; }

        public string Estado { get; set; } = "ACTIVO";
    }
}
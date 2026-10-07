namespace GraduacionWeb.API.Models
{
    public class Graduado
    {
        public int Id { get; set; }

        public string? ApplicationUserId { get; set; }

        public string Identificador { get; set; } = string.Empty;

        public string CodigoRegistro { get; set; } = string.Empty;

        public decimal TotalGraduacion { get; set; }

        public ApplicationUser? ApplicationUser { get; set; }
    }
}
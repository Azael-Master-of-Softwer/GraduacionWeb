namespace GraduacionWeb.API.Helpers
{
    public static class FechaHelper
    {
        public static DateTime AUtc(DateTime fecha) => fecha.Kind switch
        {
            DateTimeKind.Utc => fecha,
            DateTimeKind.Local => fecha.ToUniversalTime(),
            _ => DateTime.SpecifyKind(fecha, DateTimeKind.Utc)
        };
    }
}
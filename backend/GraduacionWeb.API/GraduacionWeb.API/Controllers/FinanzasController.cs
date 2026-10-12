using GraduacionWeb.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanzasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FinanzasController(AppDbContext context)
        {
            _context = context;
        }

        // Totales de dinero de la generación: cualquier usuario con sesión
        [HttpGet("resumen")]
        [Authorize]
        public async Task<IActionResult> Resumen()
        {
            var aportaciones = await _context.Pagos
                .Where(p => p.Estado == "CONFIRMADO")
                .SumAsync(p => (decimal?)p.Monto) ?? 0m;

            var ingresos = await _context.Movimientos
                .Where(m => m.Tipo == "INGRESO")
                .SumAsync(m => (decimal?)m.Monto) ?? 0m;

            var egresos = await _context.Movimientos
                .Where(m => m.Tipo == "EGRESO")
                .SumAsync(m => (decimal?)m.Monto) ?? 0m;

            return Ok(new
            {
                aportaciones,
                ingresosActividades = ingresos,
                egresos,
                disponible = aportaciones + ingresos - egresos
            });
        }
    }
}
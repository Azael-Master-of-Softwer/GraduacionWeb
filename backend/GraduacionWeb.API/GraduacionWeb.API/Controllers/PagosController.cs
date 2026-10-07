using GraduacionWeb.API.Data;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PagosController(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los pagos
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> ObtenerPagos()
        {
            var pagos = await _context.Pagos
                .Include(p => p.Graduado)
                .ToListAsync();

            return Ok(pagos);
        }

        // Registrar un pago
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CrearPago(Pago pago)
        {
            _context.Pagos.Add(pago);

            await _context.SaveChangesAsync();

            return Ok(pago);
        }
    }
}
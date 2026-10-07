using GraduacionWeb.API.Data;
using GraduacionWeb.API.DTOs;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> CrearPago(PagoCrearDto dto)
        {
            var graduado = await _context.Graduados
                .FirstOrDefaultAsync(g => g.Id == dto.GraduadoId);

            if (graduado == null)
            {
                return NotFound("El graduado no existe.");
            }

            var pago = new Pago
            {
                GraduadoId = dto.GraduadoId,
                Monto = dto.Monto,
                Concepto = dto.Concepto,
                Fecha = DateTime.Now,
                Estado = "CONFIRMADO"
            };

            _context.Pagos.Add(pago);

            await _context.SaveChangesAsync();

            return Ok(pago);
        }
    }
}
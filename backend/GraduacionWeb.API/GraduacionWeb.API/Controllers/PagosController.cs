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

            var totalPagado = await _context.Pagos
                .Where(p => p.GraduadoId == dto.GraduadoId
                         && p.Estado == "CONFIRMADO")
                .SumAsync(p => p.Monto);

            var pendiente = graduado.TotalGraduacion - totalPagado;

            if (dto.Monto > pendiente)
            {
                return BadRequest(
                    $"El pago supera el monto pendiente. Pendiente actual: {pendiente:C}"
                );
            }

            var pago = new Pago
            {
                GraduadoId = dto.GraduadoId,
                Monto = dto.Monto,
                Concepto = dto.Concepto,
                Fecha = DateTime.UtcNow,
                Estado = "CONFIRMADO"
            };

            _context.Pagos.Add(pago);

            await _context.SaveChangesAsync();

            return Ok(pago);
        }
    }
}
using GraduacionWeb.API.Data;
using GraduacionWeb.API.DTOs;
using GraduacionWeb.API.Helpers;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovimientosController(AppDbContext context)
        {
            _context = context;
        }

        // Detalle de movimientos: cualquier usuario con sesión.
        // Quién lo registró solo lo ven ADMIN y COMITE.
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var verAutor = User.IsInRole("ADMIN") || User.IsInRole("COMITE");

            var movimientos = await _context.Movimientos
                .OrderByDescending(m => m.Fecha)
                .ThenByDescending(m => m.Id)
                .Select(m => new
                {
                    m.Id,
                    m.Tipo,
                    m.Monto,
                    m.Fecha,
                    m.Concepto,
                    m.ActividadId,
                    Actividad = m.Actividad != null ? m.Actividad.Nombre : null,
                    m.RegistradoPor
                })
                .ToListAsync();

            var resultado = movimientos.Select(m => new
            {
                m.Id,
                m.Tipo,
                m.Monto,
                m.Fecha,
                m.Concepto,
                m.ActividadId,
                m.Actividad,
                RegistradoPor = verAutor ? m.RegistradoPor : null
            });

            return Ok(resultado);
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Crear(MovimientoCrearDto dto)
        {
            if (dto.ActividadId.HasValue &&
                !await _context.Actividades.AnyAsync(a => a.Id == dto.ActividadId.Value))
            {
                return NotFound("La actividad no existe.");
            }

            var movimiento = new Movimiento
            {
                Tipo = dto.Tipo,
                Monto = dto.Monto,
                Fecha = FechaHelper.AUtc(dto.Fecha!.Value),
                Concepto = dto.Concepto.Trim(),
                ActividadId = dto.ActividadId,
                RegistradoPor = User.FindFirstValue(ClaimTypes.Email) ?? "desconocido"
            };

            _context.Movimientos.Add(movimiento);
            await _context.SaveChangesAsync();

            return Ok(new { movimiento.Id, mensaje = "Movimiento registrado." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var movimiento = await _context.Movimientos
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movimiento == null)
            {
                return NotFound("El movimiento no existe.");
            }

            _context.Movimientos.Remove(movimiento);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Movimiento eliminado." });
        }
    }
}
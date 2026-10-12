using GraduacionWeb.API.Data;
using GraduacionWeb.API.DTOs;
using GraduacionWeb.API.Helpers;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActividadesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActividadesController(AppDbContext context)
        {
            _context = context;
        }

        // Actividades con sus ingresos, gastos y neto: cualquier usuario con sesión
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var sumas = await _context.Movimientos
                .Where(m => m.ActividadId != null)
                .GroupBy(m => new { m.ActividadId, m.Tipo })
                .Select(g => new
                {
                    g.Key.ActividadId,
                    g.Key.Tipo,
                    Total = g.Sum(m => m.Monto)
                })
                .ToListAsync();

            var actividades = await _context.Actividades
                .OrderByDescending(a => a.Id)
                .ToListAsync();

            var resultado = actividades.Select(a =>
            {
                var ingresos = sumas
                    .Where(s => s.ActividadId == a.Id && s.Tipo == "INGRESO")
                    .Sum(s => s.Total);

                var egresos = sumas
                    .Where(s => s.ActividadId == a.Id && s.Tipo == "EGRESO")
                    .Sum(s => s.Total);

                return new
                {
                    a.Id,
                    a.Nombre,
                    a.Descripcion,
                    a.Meta,
                    a.Fecha,
                    a.Estado,
                    ingresos,
                    egresos,
                    neto = ingresos - egresos
                };
            });

            return Ok(resultado);
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Crear(ActividadCrearDto dto)
        {
            var actividad = new Actividad
            {
                Nombre = dto.Nombre.Trim(),
                Descripcion = dto.Descripcion.Trim(),
                Meta = dto.Meta,
                Fecha = dto.Fecha.HasValue ? FechaHelper.AUtc(dto.Fecha.Value) : null,
                Estado = "ACTIVA"
            };

            _context.Actividades.Add(actividad);
            await _context.SaveChangesAsync();

            return Ok(new { actividad.Id, actividad.Nombre });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Editar(int id, ActividadEditarDto dto)
        {
            var actividad = await _context.Actividades
                .FirstOrDefaultAsync(a => a.Id == id);

            if (actividad == null)
            {
                return NotFound("La actividad no existe.");
            }

            actividad.Nombre = dto.Nombre.Trim();
            actividad.Descripcion = dto.Descripcion.Trim();
            actividad.Meta = dto.Meta;
            actividad.Fecha = dto.Fecha.HasValue ? FechaHelper.AUtc(dto.Fecha.Value) : null;
            actividad.Estado = dto.Estado;

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Actividad actualizada." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var actividad = await _context.Actividades
                .FirstOrDefaultAsync(a => a.Id == id);

            if (actividad == null)
            {
                return NotFound("La actividad no existe.");
            }

            if (await _context.Movimientos.AnyAsync(m => m.ActividadId == id))
            {
                return BadRequest("La actividad tiene movimientos registrados, por eso no se puede eliminar. Márcala como terminada.");
            }

            _context.Actividades.Remove(actividad);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Actividad eliminada." });
        }
    }
}
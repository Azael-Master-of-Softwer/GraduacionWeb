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
    public class ConfiguracionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConfiguracionController(AppDbContext context)
        {
            _context = context;
        }

        // Datos generales de la generación: los puede ver cualquier usuario con sesión
        [HttpGet("general")]
        [Authorize]
        public async Task<IActionResult> ObtenerGeneral()
        {
            var config = await _context.Configuracion
                .AsNoTracking()
                .FirstOrDefaultAsync();

            var totalRecaudado = await _context.Pagos
                .Where(p => p.Estado == "CONFIRMADO")
                .SumAsync(p => (decimal?)p.Monto) ?? 0m;

            var totalMeta = await _context.Graduados
                .SumAsync(g => (decimal?)g.TotalGraduacion) ?? 0m;

            var graduados = await _context.Graduados.CountAsync();

            var registrados = await _context.Graduados
                .CountAsync(g => g.ApplicationUserId != null);

            return Ok(new
            {
                fechaGraduacion = config?.FechaGraduacion,
                metaPorAlumno = config?.MetaPorAlumno,
                totalRecaudado,
                totalMeta,
                graduados,
                registrados
            });
        }

        // Guardar la configuración: solo el administrador
        [HttpPut]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Actualizar(ConfiguracionActualizarDto dto)
        {
            var config = await _context.Configuracion.FirstOrDefaultAsync();

            if (config == null)
            {
                config = new ConfiguracionGeneral();
                _context.Configuracion.Add(config);
            }

            // Solo se reparte la meta a todos si el valor realmente cambió
            var cambioMeta = dto.MetaPorAlumno.HasValue
                && config.MetaPorAlumno != dto.MetaPorAlumno;

            config.FechaGraduacion = dto.FechaGraduacion.HasValue
                ? FechaHelper.AUtc(dto.FechaGraduacion.Value)
                : null;
            config.MetaPorAlumno = dto.MetaPorAlumno;

            await using var transaccion =
                await _context.Database.BeginTransactionAsync();

            await _context.SaveChangesAsync();

            if (cambioMeta)
            {
                var meta = dto.MetaPorAlumno!.Value;

                await _context.Graduados.ExecuteUpdateAsync(s =>
                    s.SetProperty(g => g.TotalGraduacion, meta));
            }

            await transaccion.CommitAsync();

            return Ok(new
            {
                mensaje = "Configuración guardada.",
                metaAplicadaATodos = cambioMeta
            });
        }
    }
}
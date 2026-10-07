using GraduacionWeb.API.Data;
using GraduacionWeb.API.DTOs;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GraduadosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GraduadosController(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los graduados
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> ObtenerGraduados()
        {
            var graduados = await _context.Graduados.ToListAsync();
            return Ok(graduados);
        }

        // Crear un nuevo graduado
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CrearGraduado(Graduado graduado)
        {
            string codigo;

            do
            {
                codigo = Convert.ToHexString(
                    RandomNumberGenerator.GetBytes(4)
                );
            }
            while (await _context.Graduados.AnyAsync(
                g => g.CodigoRegistro == codigo
            ));

            graduado.CodigoRegistro = codigo;
            graduado.ApplicationUserId = null;

            _context.Graduados.Add(graduado);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Graduado creado correctamente.",
                graduado.Id,
                graduado.Identificador,
                graduado.TotalGraduacion,
                codigoRegistro = codigo
            });
        }

        // Obtener el resumen de un graduado
        [HttpGet("{id}/resumen")]
        [Authorize]
        public async Task<IActionResult> ObtenerResumen(int id)
        {
            var usuarioId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var graduado = await _context.Graduados
                .FirstOrDefaultAsync(g =>
                    g.Id == id &&
                    g.ApplicationUserId == usuarioId);

            if (graduado == null)
            {
                return NotFound("Graduado no encontrado.");
            }

            var pagos = await _context.Pagos
                .Where(p => p.GraduadoId == id)
                .ToListAsync();

            var totalPagado = pagos
                .Where(p => p.Estado == "CONFIRMADO")
                .Sum(p => p.Monto);

            var resumen = new ResumenGraduadoDto
            {
                Identificador = graduado.Identificador,
                TotalGraduacion = graduado.TotalGraduacion,
                TotalPagado = totalPagado,
                Pendiente = graduado.TotalGraduacion - totalPagado,

                Pagos = pagos.Select(p => new PagoResumenDto
                {
                    Fecha = p.Fecha,
                    Monto = p.Monto,
                    Concepto = p.Concepto,
                    Estado = p.Estado
                }).ToList()
            };

            return Ok(resumen);
        }

        [HttpGet("mi-resumen")]
        [Authorize(Roles = "GRADUADO")]
        public async Task<IActionResult> ObtenerMiResumen()
        {
            var usuarioId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var graduado = await _context.Graduados
                .FirstOrDefaultAsync(g => g.ApplicationUserId == usuarioId);

            if (graduado == null)
            {
                return NotFound("No existe un registro de graduado asociado a este usuario.");
            }

            var pagos = await _context.Pagos
                .Where(p => p.GraduadoId == graduado.Id)
                .ToListAsync();

            var totalPagado = pagos
                .Where(p => p.Estado == "CONFIRMADO")
                .Sum(p => p.Monto);

            var resumen = new ResumenGraduadoDto
            {
                Identificador = graduado.Identificador,
                TotalGraduacion = graduado.TotalGraduacion,
                TotalPagado = totalPagado,
                Pendiente = graduado.TotalGraduacion - totalPagado,
                Pagos = pagos.Select(p => new PagoResumenDto
                {
                    Fecha = p.Fecha,
                    Monto = p.Monto,
                    Concepto = p.Concepto,
                    Estado = p.Estado
                }).ToList()
            };

            return Ok(resumen);
        }

    }
}
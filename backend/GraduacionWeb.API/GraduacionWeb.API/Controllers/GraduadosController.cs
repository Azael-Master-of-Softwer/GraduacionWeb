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
        public async Task<IActionResult> CrearGraduado(GraduadoCrearDto dto)
        {
            var identificador = dto.Identificador.Trim();

            if (await _context.Graduados.AnyAsync(g => g.Identificador == identificador))
            {
                return Conflict("Ya existe un graduado con ese identificador.");
            }

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

            var graduado = new Graduado
            {
                Identificador = identificador,
                TotalGraduacion = dto.TotalGraduacion,
                CodigoRegistro = codigo,
                ApplicationUserId = null
            };

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

        // Arma el resumen de un graduado (lo usan los dos endpoints)
        private async Task<ResumenGraduadoDto> ConstruirResumenAsync(Graduado graduado)
        {
            var pagos = await _context.Pagos
                .Where(p => p.GraduadoId == graduado.Id)
                .OrderBy(p => p.Fecha)
                .ToListAsync();

            var totalPagado = pagos
                .Where(p => p.Estado == "CONFIRMADO")
                .Sum(p => p.Monto);

            return new ResumenGraduadoDto
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
        }

        // Resumen de un graduado: el ADMIN ve cualquiera, el GRADUADO solo el suyo
        [HttpGet("{id}/resumen")]
        [Authorize(Roles = "ADMIN,GRADUADO")]
        public async Task<IActionResult> ObtenerResumen(int id)
        {
            var graduado = await _context.Graduados
                .FirstOrDefaultAsync(g => g.Id == id);

            if (graduado == null)
            {
                return NotFound("Graduado no encontrado.");
            }

            if (!User.IsInRole("ADMIN"))
            {
                var usuarioId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (graduado.ApplicationUserId != usuarioId)
                {
                    return NotFound("Graduado no encontrado.");
                }
            }

            return Ok(await ConstruirResumenAsync(graduado));
        }

        // Resumen del graduado que tiene la sesión iniciada
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

            return Ok(await ConstruirResumenAsync(graduado));
        }
    }
}


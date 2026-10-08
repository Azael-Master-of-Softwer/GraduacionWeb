using GraduacionWeb.API.Data;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GraduacionWeb.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvisosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AvisosController(AppDbContext context)
        {
            _context = context;
        }
        // Obtener avisos: el ADMIN ve todos, el GRADUADO solo los ACTIVOS
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ObtenerAvisos()
        {
            var consulta = _context.Avisos.AsQueryable();

            if (!User.IsInRole("ADMIN"))
            {
                consulta = consulta.Where(a => a.Estado == "ACTIVO");
            }

            var avisos = await consulta
                .OrderByDescending(a => a.Fecha)
                .ToListAsync();

            return Ok(avisos);
        }
        // Crear un nuevo aviso
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CrearAviso(AvisoCrearDto dto)
        {
            var aviso = new Aviso
            {
                Titulo = dto.Titulo.Trim(),
                Mensaje = dto.Mensaje.Trim(),
                Fecha = DateTime.UtcNow,
                Estado = "ACTIVO"
            };

            _context.Avisos.Add(aviso);

            await _context.SaveChangesAsync();

            return Ok(aviso);
        }

        // Editar un aviso existente
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> EditarAviso(int id, AvisoEditarDto dto)
        {
            var aviso = await _context.Avisos
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aviso == null)
            {
                return NotFound("El aviso no existe.");
            }

            aviso.Titulo = dto.Titulo.Trim();
            aviso.Mensaje = dto.Mensaje.Trim();
            aviso.Estado = dto.Estado;

            await _context.SaveChangesAsync();

            return Ok(aviso);
        }
        // Eliminar un aviso
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> EliminarAviso(int id)
        {
            var aviso = await _context.Avisos
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aviso == null)
            {
                return NotFound("El aviso no existe.");
            }

            _context.Avisos.Remove(aviso);

            await _context.SaveChangesAsync();

            return Ok("Aviso eliminado correctamente.");
        }

    }
}
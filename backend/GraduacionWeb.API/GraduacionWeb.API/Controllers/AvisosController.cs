using GraduacionWeb.API.Data;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        // Obtener todos los avisos
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ObtenerAvisos()
        {
            var avisos = await _context.Avisos
                .OrderByDescending(a => a.Fecha)
                .ToListAsync();

            return Ok(avisos);
        }
        // Crear un nuevo aviso
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CrearAviso(Aviso aviso)
        {
            aviso.Fecha = DateTime.UtcNow;
            aviso.Estado = "ACTIVO";

            _context.Avisos.Add(aviso);

            await _context.SaveChangesAsync();

            return Ok(aviso);
        }
        // Editar un aviso existente
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> EditarAviso(
            int id,
            Aviso avisoActualizado)
        {
            var aviso = await _context.Avisos
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aviso == null)
            {
                return NotFound("El aviso no existe.");
            }

            aviso.Titulo = avisoActualizado.Titulo;
            aviso.Mensaje = avisoActualizado.Mensaje;
            aviso.Estado = avisoActualizado.Estado;

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
using GraduacionWeb.API.Data;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GraduacionWeb.API.Helpers;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosCalendarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventosCalendarioController(AppDbContext context)
        {
            _context = context;
        }
        // Obtener todos los eventos del calendario
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> ObtenerEventos()
        {
            var eventos = await _context.EventosCalendario
                .OrderBy(e => e.Fecha)
                .ToListAsync();

            return Ok(eventos);
        }
        // Crear un nuevo evento en el calendario
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CrearEvento(EventoCalendario evento)
        {
            evento.Fecha = FechaHelper.AUtc(evento.Fecha);

            _context.EventosCalendario.Add(evento);

            await _context.SaveChangesAsync();

            return Ok(evento);
        }
        // Editar un evento existente en el calendario
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> EditarEvento(
            int id,
            EventoCalendario eventoActualizado)
        {
            var evento = await _context.EventosCalendario
                .FirstOrDefaultAsync(e => e.Id == id);

            if (evento == null)
            {
                return NotFound("El evento no existe.");
            }

            evento.Fecha = FechaHelper.AUtc(eventoActualizado.Fecha);
            evento.Titulo = eventoActualizado.Titulo;
            evento.Tipo = eventoActualizado.Tipo;
            evento.Descripcion = eventoActualizado.Descripcion;
            evento.Estado = eventoActualizado.Estado;

            await _context.SaveChangesAsync();

            return Ok(evento);
        }
        // Eliminar un evento del calendario
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> EliminarEvento(int id)
        {
            var evento = await _context.EventosCalendario
                .FirstOrDefaultAsync(e => e.Id == id);

            if (evento == null)
            {
                return NotFound("El evento no existe.");
            }

            _context.EventosCalendario.Remove(evento);

            await _context.SaveChangesAsync();

            return Ok("Evento eliminado correctamente.");
        }

    }
}
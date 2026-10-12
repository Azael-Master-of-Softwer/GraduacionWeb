using GraduacionWeb.API.Data;
using GraduacionWeb.API.DTOs;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UsuariosController(
            AppDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // Lista de cuentas con su rango y el graduado al que están ligadas
        [HttpGet]
        public async Task<IActionResult> ObtenerUsuarios()
        {
            var usuarios = await _userManager.Users
                .OrderBy(u => u.Nombre)
                .ToListAsync();

            var vinculos = await _context.Graduados
                .Where(g => g.ApplicationUserId != null)
                .Select(g => new { g.ApplicationUserId, g.Identificador })
                .ToListAsync();

            var resultado = new List<object>();

            foreach (var u in usuarios)
            {
                var roles = await _userManager.GetRolesAsync(u);

                resultado.Add(new
                {
                    id = u.Id,
                    nombre = u.Nombre,
                    email = u.Email,
                    roles,
                    identificador = vinculos
                        .FirstOrDefault(v => v.ApplicationUserId == u.Id)?.Identificador
                });
            }

            return Ok(resultado);
        }

        // Agregar o quitar a una persona del Comité (un ADMIN no se puede cambiar)
        [HttpPut("{id}/comite")]
        public async Task<IActionResult> CambiarComite(string id, ComiteDto dto)
        {
            var usuario = await _userManager.FindByIdAsync(id);

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            if (await _userManager.IsInRoleAsync(usuario, "ADMIN"))
            {
                return BadRequest("No se puede cambiar el rango de un administrador.");
            }

            var yaEsComite = await _userManager.IsInRoleAsync(usuario, "COMITE");

            if (dto.EsComite && !yaEsComite)
            {
                var resultado = await _userManager.AddToRoleAsync(usuario, "COMITE");

                if (!resultado.Succeeded)
                {
                    return BadRequest(resultado.Errors);
                }
            }
            else if (!dto.EsComite && yaEsComite)
            {
                var resultado = await _userManager.RemoveFromRoleAsync(usuario, "COMITE");

                if (!resultado.Succeeded)
                {
                    return BadRequest(resultado.Errors);
                }
            }

            return Ok(new
            {
                mensaje = dto.EsComite
                    ? "Ahora forma parte del Comité."
                    : "Ya no forma parte del Comité."
            });
        }
    }
}
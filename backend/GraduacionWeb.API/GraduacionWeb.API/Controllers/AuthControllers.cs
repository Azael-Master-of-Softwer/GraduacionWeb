using GraduacionWeb.API.Data;
using GraduacionWeb.API.DTOs;
using GraduacionWeb.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.RateLimiting;
using System.Text;

namespace GraduacionWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            AppDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        // REGISTRO
        [AllowAnonymous]
        [EnableRateLimiting("auth")]
        [HttpPost("registro")]
        public async Task<IActionResult> Registro(RegistroDto registro)
        {
            // 1. Buscar el graduado mediante su código
            var graduado = await _context.Graduados
                .FirstOrDefaultAsync(g =>
                    g.CodigoRegistro == registro.CodigoRegistro);

            // 2. Comprobar que el código existe
            if (graduado == null)
            {
                return BadRequest("El código de registro no es válido.");
            }

            // 3. Comprobar que el código todavía no fue utilizado
            if (!string.IsNullOrEmpty(graduado.ApplicationUserId))
            {
                return BadRequest("Este código de registro ya fue utilizado.");
            }

            // 4. Crear el usuario
            var usuario = new ApplicationUser
            {
                UserName = registro.Email,
                Email = registro.Email,
                Nombre = registro.Nombre
            };

            var resultado = await _userManager.CreateAsync(
                usuario,
                registro.Password
            );

            if (!resultado.Succeeded)
            {
                return BadRequest(resultado.Errors);
            }

            // 5. Asignar el rol de GRADUADO
            var resultadoRol = await _userManager.AddToRoleAsync(
                usuario,
                "GRADUADO"
            );

            if (!resultadoRol.Succeeded)
            {
                await _userManager.DeleteAsync(usuario);

                return BadRequest(resultadoRol.Errors);
            }

            // 6. Vincular el usuario con el graduado
            graduado.ApplicationUserId = usuario.Id;

            await _context.SaveChangesAsync();

            // 7. Respuesta
            return Ok(new
            {
                mensaje = "Usuario y graduado creados correctamente",
                email = usuario.Email,
                identificador = graduado.Identificador
            });
        }

        // LOGIN
        [AllowAnonymous]
        [EnableRateLimiting("auth")]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            var usuario = await _userManager.FindByEmailAsync(login.Email);

            if (usuario == null)
            {
                return Unauthorized("Correo o contraseña incorrectos.");
            }

            var resultado = await _signInManager.CheckPasswordSignInAsync(
                usuario,
                login.Password,
                true
            );

            if (resultado.IsLockedOut)
            {
                return StatusCode(
                    StatusCodes.Status429TooManyRequests,
                    "Demasiados intentos fallidos. Intenta de nuevo en unos minutos."
                );
            }

            if (!resultado.Succeeded)
            {
                return Unauthorized("Correo o contraseña incorrectos.");
            }

            var roles = await _userManager.GetRolesAsync(usuario);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id),
                new Claim(ClaimTypes.Name, usuario.UserName ?? ""),
                new Claim(ClaimTypes.Email, usuario.Email ?? "")
            };

            foreach (var rol in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, rol));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!
                )
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);

            return Ok(new
            {
                mensaje = "Login correcto",
                token = tokenString
            });
        }
        //Perfil protegido
        [HttpGet("perfil")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult Perfil()
        {
            return Ok(new
            {
                mensaje = "Tienes acceso a una zona protegida.",
                usuario = User.Identity?.Name
            });
        }
        //Zona de administrador protegida
        [HttpGet("admin")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "ADMIN")]
        public IActionResult ZonaAdmin()
        {
            return Ok(new
            {
                mensaje = "Tienes acceso a la zona de administrador.",
                usuario = User.Identity?.Name
            });
        }
        //Zona de graduado protegida
        [HttpGet("graduado")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "GRADUADO")]
        public IActionResult ZonaGraduado()
        {
            return Ok(new
            {
                mensaje = "Tienes acceso a la zona de graduados.",
                usuario = User.Identity?.Name
            });
        }

    }
}
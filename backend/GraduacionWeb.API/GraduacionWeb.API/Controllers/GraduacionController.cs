using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace GraduacionWeb.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraduacionController : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet]
        public IActionResult ObtenerMensaje()
        {
            return Ok(new
            {
                Mensaje = "Sistema de Graduación Funcionando"
            });
        }
    }
}

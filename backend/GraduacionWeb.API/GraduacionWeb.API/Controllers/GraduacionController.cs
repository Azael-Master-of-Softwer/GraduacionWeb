using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GraduacionWeb.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraduacionController : ControllerBase
    {
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

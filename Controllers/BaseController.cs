using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;

namespace SkillsMatrix.Controllers
{
    public class BaseController : Controller
    {
        protected readonly SkillsMatrixContext db;

        public BaseController(SkillsMatrixContext context)
        {
            db = context;
        }
    }
}

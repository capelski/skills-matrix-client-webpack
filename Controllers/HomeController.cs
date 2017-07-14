using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace SkillsMatrix.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("Home");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}

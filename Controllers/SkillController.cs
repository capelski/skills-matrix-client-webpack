using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace SkillsMatrix.Controllers
{
    public class SkillController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Details(int id)
        {
            ViewData["ReadOnly"] = true;
            return View("Details", id);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            ViewData["ReadOnly"] = false;
            return View("Details", id);
        }
    }
}

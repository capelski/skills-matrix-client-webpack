using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services.Interfaces;

namespace SkillsMatrix.Controllers
{
    public class SkillController : Controller
    {
        private IEntityService<Skill, int> _skillService {get; set;}

        public SkillController(IEntityService<Skill, int> skillService)
        {
            _skillService = skillService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            IEnumerable<Skill> skills = _skillService.GetAll();
            return View(skills);
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

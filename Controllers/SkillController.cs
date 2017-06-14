using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services;
using SkillsMatrix.Services.Interfaces;

namespace SkillsMatrix.Controllers
{
    public partial class SkillController : Controller
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
            Skill skill = _skillService.GetById(id);
            ViewData["Mode"] = "Read";
            return View("Details", skill);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            Skill skill = _skillService.GetById(id);
            ViewData["Mode"] = "Edit";
            return View("Details", skill);
        }
    }
}

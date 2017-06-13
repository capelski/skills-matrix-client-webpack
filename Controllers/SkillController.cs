using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services;

namespace SkillsMatrix.Controllers
{
    public partial class SkillController : BaseController
    {
        private SkillService _skillService {get; set;}

        public SkillController(SkillsMatrixContext context)
            :base(context)
        {
            _skillService = new SkillService(context);
        }

        [HttpGet]
        public IActionResult Index()
        {
            List<Skill> skills = db.Skills.ToList();
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

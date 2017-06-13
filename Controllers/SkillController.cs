using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;

namespace SkillsMatrix.Controllers
{
    public partial class SkillController : BaseController
    {
        public SkillController(SkillsMatrixContext context)
            :base(context)
        {
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
            Skill skill = db.Skills.Find(id);
            ViewData["Mode"] = "Read";
            return View("Details", skill);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            Skill skill = db.Skills.Find(id);
            ViewData["Mode"] = "Edit";
            return View("Details", skill);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services;

namespace SkillsMatrix.Controllers.Api
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
        public IActionResult Get(int page = 0)
        {
            int pageSize = 10;
            var offset = page * pageSize;
            var skills = db.Skills.Skip(offset).Take(pageSize).ToList();
            return Ok(skills);
        }
                
        [HttpGet]
        public IActionResult GetById(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }

            var skill = _skillService.GetById(id);
            if (skill == null)
            {
                return NotFound();
            }
            
            return Ok(skill);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Skill skill)
        {
            if (skill == null || String.IsNullOrEmpty(skill.Name))
            {
                return BadRequest();
            }

            db.Skills.Add(skill);
            db.SaveChanges();
            
            return Ok(skill);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Skill skill)
        {
            if (skill == null)
            {
                return BadRequest();
            }

            var result = db.Skills.Find(skill.Id);
            if (result == null)
            {
                return NotFound();
            }

            result.Name = skill.Name;
            db.SaveChanges();
            
            return Ok(skill);
        }
                
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }

            var skill = db.Skills.Find(id);
            if (skill == null)
            {
                return NotFound();
            }

            db.Skills.Remove(skill);
            db.SaveChanges();
            
            return Ok(skill);
        }
    }
}

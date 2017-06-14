using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services;
using SkillsMatrix.Services.Interfaces;

namespace SkillsMatrix.Controllers.Api
{
    public partial class SkillController : Controller
    {
        private IEntityService<Skill, int> _skillService {get; set;}

        public SkillController(IEntityService<Skill, int> skillService)
        {
            _skillService = skillService;
        }
                
        [HttpGet]
        public IActionResult Get(int page = 0, int pageSize = 10)
        {
            var skills = _skillService.GetAll(page, pageSize);
            return Ok(skills);
        }
                
        [HttpGet]
        public IActionResult GetById(int id)
        {
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

            skill = _skillService.Create(skill);
            
            return Ok(skill);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Skill skill)
        {
            if (skill == null)
            {
                return BadRequest();
            }

            var result = _skillService.Update(skill);
            if (result == null)
            {
                return NotFound();
            }
            
            return Ok(result);
        }
                
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var skill = _skillService.Delete(id);
            if (skill == null)
            {
                return NotFound();
            }
            
            return Ok(skill);
        }
    }
}

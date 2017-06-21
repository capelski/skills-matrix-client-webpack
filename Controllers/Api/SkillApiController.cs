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
    [Route("api/skill")]
    public class SkillApiController : Controller
    {
        private IEntityService<Skill, int> _skillService {get; set;}

        private QueryService _queryService {get; set;}

        public SkillApiController(IEntityService<Skill, int> skillService, QueryService queryService)
        {
            _skillService = skillService;
            _queryService = queryService;
        }
                
        [HttpGet]
        public IActionResult Get(string keywords = "", int page = 0, int pageSize = 10)
        {
            var skills = _skillService.GetAll(keywords, page, pageSize);
            return Ok(skills);
        }
                
        [HttpGet("getById")]
        public IActionResult GetById(int id)
        {
            var skill = _skillService.GetById(id);
            if (skill == null)
            {
                return NotFound();
            }
            
            return Ok(skill);
        }
                
        [HttpGet("getRearest")]
        public IActionResult GetRearest()
        {
            var skills = _queryService.RearestSkills();
            return Ok(skills);
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

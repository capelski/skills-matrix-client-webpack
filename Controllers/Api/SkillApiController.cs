using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services;
using SkillsMatrix.Commons;

namespace SkillsMatrix.Controllers.Api
{
    [Route("api/skill")]
    public class SkillApiController : GenericApiController<Skill, int, IEntityService<Skill, int>>
    {
        private QueryService _queryService {get; set;}

        public SkillApiController(IEntityService<Skill, int> skillService, QueryService queryService)
            :base(skillService)
        {
            _queryService = queryService;
        }

        protected override bool CreateConditions(Skill entity)
        {
            return entity != null && !String.IsNullOrEmpty(entity.Name);
        }
                
        [HttpGet("getRearest")]
        public IActionResult GetRearest()
        {
            var skills = _queryService.RearestSkills();
            return Ok(skills);
        }
    }
}

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
    [Route("api/employee")]
    public class EmployeeApiController : GenericApiController<Employee, int, IEntityService<Employee, int>>
    {
        private QueryService _queryService {get; set;}

        public EmployeeApiController(IEntityService<Employee, int> employeeService, QueryService queryService)
            :base(employeeService)
        {
            _queryService = queryService;
        }

        protected override bool CreateConditions(Employee entity)
        {
            return entity != null && !String.IsNullOrEmpty(entity.Name);
        }
                
        [HttpGet("getMostSkilled")]
        public IActionResult GetMostSkilled()
        {
            var employees = _queryService.MostSkilledEmployees();
            return Ok(employees);
        }
    }
}

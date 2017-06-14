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
    [Route("api/employee")]
    public class EmployeeApiController : Controller
    {
        private IEntityService<Employee, int> _employeeService {get; set;}

        public EmployeeApiController(IEntityService<Employee, int> employeeService)
        {
            _employeeService = employeeService;
        }
                
        [HttpGet]
        public IActionResult Get(int page = 0, int pageSize = 10)
        {
            var employees = _employeeService.GetAll(page, pageSize);
            return Ok(employees);
        }
                
        [HttpGet("getById")]
        public IActionResult GetById(int id)
        {
            var employee = _employeeService.GetById(id);            
            if (employee == null)
            {
                return NotFound();
            }
            
            return Ok(employee);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Employee employee)
        {
            if (employee == null || String.IsNullOrEmpty(employee.Name))
            {
                return BadRequest();
            }

            employee = _employeeService.Create(employee);
            
            return Ok(employee);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Employee employee)
        {
            if (employee == null)
            {
                return BadRequest();
            }

            var result = _employeeService.Update(employee);
            if (result == null)
            {
                return NotFound();
            }
            
            return Ok(result);
        }
                
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var employee = _employeeService.Delete(id);
            if (employee == null)
            {
                return NotFound();
            }
            
            return Ok(employee);
        }
    }
}

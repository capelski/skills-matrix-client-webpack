using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services;

namespace SkillsMatrix.Controllers.Api
{
    public partial class EmployeeController : BaseController
    {
        private EmployeeService _employeeService {get; set;}

        public EmployeeController(SkillsMatrixContext context)
            :base(context)
        {
            _employeeService = new EmployeeService(context);
        }
                
        [HttpGet]
        public IActionResult Get(int page = 0)
        {
            int pageSize = 10;
            var offset = page * pageSize;
            var employees = db.Employees.Skip(offset).Take(pageSize).ToList();
            return Ok(employees);
        }
                
        [HttpGet]
        public IActionResult GetById(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }

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

            db.Employees.Add(employee);
            db.SaveChanges();
            
            return Ok(employee);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Employee employee)
        {
            if (employee == null)
            {
                return BadRequest();
            }

            var result = db.Employees.Find(employee.Id);
            if (result == null)
            {
                return NotFound();
            }

            result.Name = employee.Name;
            db.SaveChanges();
            
            return Ok(employee);
        }
                
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            if (id < 1)
            {
                return BadRequest();
            }

            var employee = db.Employees.Find(id);
            if (employee == null)
            {
                return NotFound();
            }

            db.Employees.Remove(employee);
            db.SaveChanges();
            
            return Ok(employee);
        }
    }
}

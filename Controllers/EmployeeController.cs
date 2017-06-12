using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;

namespace SkillsMatrix.Controllers
{
    public class EmployeeController : BaseController
    {
        public EmployeeController(SkillsMatrixContext context)
            :base(context)
        {
        }

        [HttpGet]
        public IActionResult Index(int id)
        {
            List<Employee> employees = db.Employees.ToList();
            return View(employees);
        }

        [HttpGet]
        public IActionResult Details(int id)
        {
            Employee employee = db.Employees.Find(id);
            return View(employee);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            Employee employee = db.Employees.Find(id);
            return View(employee);
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
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services;

namespace SkillsMatrix.Controllers
{
    public class EmployeeController : BaseController
    {
        private EmployeeService _employeeService {get; set;}

        public EmployeeController(SkillsMatrixContext context)
            :base(context)
        {
            _employeeService = new EmployeeService(context);
        }

        [HttpGet]
        public IActionResult Index()
        {
            List<Employee> employees = db.Employees.ToList();
            return View(employees);
        }

        [HttpGet]
        public IActionResult Details(int id)
        {
            Employee employee = _employeeService.GetById(id);
            ViewData["Mode"] = "Read";
            return View("Details", employee);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            Employee employee = _employeeService.GetById(id);
            ViewData["Mode"] = "Edit";
            return View("Details", employee);
        }
    }
}

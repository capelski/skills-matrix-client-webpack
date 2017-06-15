using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;
using SkillsMatrix.Services.Interfaces;

namespace SkillsMatrix.Controllers
{
    public class EmployeeController : Controller
    {
        private IEntityService<Employee, int> _employeeService {get; set;}

        public EmployeeController(IEntityService<Employee, int> employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            IEnumerable<Employee> employees = _employeeService.GetAll();
            return View(employees);
        }

        [HttpGet]
        public IActionResult Details(int id)
        {
            ViewData["ReadOnly"] = true;
            return View("Details", id);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            ViewData["ReadOnly"] = false;
            return View("Details", id);
        }
    }
}

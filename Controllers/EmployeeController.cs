using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SkillsMatrix.Models;

namespace SkillsMatrix.Controllers
{
    public partial class EmployeeController : BaseController
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
            ViewData["Mode"] = "Read";
            return View(employee);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            Employee employee = db.Employees.Find(id);
            ViewData["Mode"] = "Edit";
            return View("Details", employee);
        }
    }
}

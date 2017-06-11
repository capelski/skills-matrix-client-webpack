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

        public IActionResult Index(int id)
        {
            List<Employee> employees = db.Employees.ToList();
            return View(employees);
        }

        public IActionResult Details(int id)
        {
            Employee employee = db.Employees.Find(id);
            return View(employee);
        }
    }
}

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
            return View(db.Employees.ToList());
        }

        public IActionResult Details(int id)
        {
            Employee employee = new Employee{
                Id = id,
                Name = "Random one"
            };
            return View(employee);
        }
    }
}

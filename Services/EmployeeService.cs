using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SkillsMatrix.Models;

namespace SkillsMatrix.Services
{
    public partial class EmployeeService: BaseService
    {
        public EmployeeService(SkillsMatrixContext context)
            :base(context)
        {
        }
                
        public Employee GetById(int id)
        {
            var employee = db.Employees
                .Include(e => e.EmployeeSkills)
                .ThenInclude(es => es.Skill)
                .Single(e => e.Id == id);
                
            employee.Skills = employee.EmployeeSkills.Select(es => es.Skill).ToList();

            return employee;
        }
    }
}

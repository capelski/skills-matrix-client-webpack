using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SkillsMatrix.Commons;
using SkillsMatrix.Models;

namespace SkillsMatrix.Services
{
    public class EmployeeService: BaseService, IEntityService<Employee, int>
    {
        public EmployeeService(SkillsMatrixContext context)
            :base(context)
        {
        }

        public Employee Create(Employee entity)
        {
            db.Employees.Add(entity);
            List<EmployeeSkill> employeeSkills = entity.Skills.Select(s => new EmployeeSkill { EmployeeId = entity.Id, SkillId = s.Id }).ToList();
            db.Employee_Skill.AddRange(employeeSkills);
            db.SaveChanges();
            return entity;
        }

        public Employee Delete(int id)
        {
            var employee = db.Employees.Find(id);
            if (employee != null)
            {
                db.Employees.Remove(employee);
                db.SaveChanges();
            }

            return employee;
        }

        public IEnumerable<Employee> GetAll(string keywords = "", int page = 0, int pageSize = 10)
        {
            var offset = page * pageSize;
            IEnumerable<Employee> source = db.Employees;
            if (!String.IsNullOrEmpty(keywords)) {
                source = source.Where(e => e.Name.ToLower().Contains(keywords.ToLower()));
            }
            var employees = source.Skip(offset).Take(pageSize).ToList();
            return employees;
        }

        public Employee GetById(int id)
        {
            var employee = db.Employees
                .Include(e => e.EmployeeSkills)
                .ThenInclude(es => es.Skill)
                .FirstOrDefault(e => e.Id == id);
                
            if (employee != null) {
                employee.Skills = employee.EmployeeSkills.Select(es => es.Skill).ToList();
            }

            return employee;
        }

        public Employee Update(Employee entity)
        {
            var employee = GetById(entity.Id);
            if (employee != null)
            {
                employee.Name = entity.Name;
                List<EmployeeSkill> employeeSkills = entity.Skills.Select(s => new EmployeeSkill { EmployeeId = employee.Id, SkillId = s.Id }).ToList();
                Utils.UpdateDbSet(db.Employee_Skill, employeeSkills, employee.EmployeeSkills, (a, b) => a.EmployeeId == b.EmployeeId && a.SkillId == b.SkillId);
                db.SaveChanges();
            }

            return employee;
        }
    }
}

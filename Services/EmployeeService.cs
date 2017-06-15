using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SkillsMatrix.Models;
using SkillsMatrix.Services.Interfaces;

namespace SkillsMatrix.Services
{
    public partial class EmployeeService: BaseService, IEntityService<Employee, int>
    {
        public EmployeeService(SkillsMatrixContext context)
            :base(context)
        {
        }

        public Employee Create(Employee entity)
        {
            db.Employees.Add(entity);
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
                source = source.Where(e => e.Name.Contains(keywords));
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
            var employee = db.Employees.Find(entity.Id);
            if (employee != null)
            {
                employee.Name = entity.Name;
                db.SaveChanges();
            }

            return employee;
        }
    }
}

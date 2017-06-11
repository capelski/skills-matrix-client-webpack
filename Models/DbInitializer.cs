using System;
using System.Collections.Generic;
using System.Linq;

namespace SkillsMatrix.Models
{
    public static class DbInitializer
    {
        public static void Initialize(SkillsMatrixContext context)
        {
            context.Database.EnsureCreated();

            if (context.Employees.Any())
            {
                return;
            }

            var employees = new List<Employee>
            {
                new Employee{Name = "Chris Brown"},
                new Employee{Name = "Eric Prydz"},
                new Employee{Name = "Alan Walker"},
                new Employee{Name = "Lost Frequencies"},
                new Employee{Name = "Sean Paul"},
                new Employee{Name = "Calvin Harris"}
            };
            foreach (Employee e in employees)
            {
                context.Employees.Add(e);
            }
            context.SaveChanges();
        }
    }
}
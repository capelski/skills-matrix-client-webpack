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

            if (!context.Employees.Any())
            {
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

            if (!context.Skills.Any())
            {
                var skills = new List<Skill>
                {
                    new Skill{Name = "HTML 5"},
                    new Skill{Name = "CSS 3"},
                    new Skill{Name = "JavaScript"},
                    new Skill{Name = "Angular JS"},
                    new Skill{Name = "React JS"},
                    new Skill{Name = "Node JS"},
                    new Skill{Name = "ASP.NET"}
                };
                foreach (Skill s in skills)
                {
                    context.Skills.Add(s);
                }
                context.SaveChanges();
            }
        }
    }
}
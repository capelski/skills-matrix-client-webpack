using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace SkillsMatrix.Models
{
    public class SkillsMatrixContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }

        public DbSet<Skill> Skills { get; set; }

        public DbSet<EmployeeSkill> Employee_Skill { get; set; }

        public SkillsMatrixContext(DbContextOptions<SkillsMatrixContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>().Ignore(e => e.Skills).ToTable("employee");
            modelBuilder.Entity<Skill>().Ignore(s => s.Employees).ToTable("skill");
            modelBuilder.Entity<EmployeeSkill>().ToTable("employee_skill").HasKey(es => new { es.EmployeeId, es.SkillId});

            modelBuilder.Entity<EmployeeSkill>()
                .HasOne(es => es.Employee)
                .WithMany(employee => employee.EmployeeSkills)
                .HasForeignKey(es => es.EmployeeId);

            modelBuilder.Entity<EmployeeSkill>()
                .HasOne(es => es.Skill)
                .WithMany(skill => skill.SkillEmployees)
                .HasForeignKey(es => es.SkillId);
        }
    }
}

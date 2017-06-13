using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace SkillsMatrix.Models
{
    public class SkillsMatrixContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }

        public DbSet<Skill> Skills { get; set; }

        public SkillsMatrixContext(DbContextOptions<SkillsMatrixContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>().ToTable("Employee");
            modelBuilder.Entity<Skill>().ToTable("Skill");
        }
    }
}

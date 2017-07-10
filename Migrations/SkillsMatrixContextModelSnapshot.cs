using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using SkillsMatrix.Models;

namespace SkillsMatrix.Migrations
{
    [DbContext(typeof(SkillsMatrixContext))]
    partial class SkillsMatrixContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1");

            modelBuilder.Entity("SkillsMatrix.Models.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("employee");
                });

            modelBuilder.Entity("SkillsMatrix.Models.EmployeeSkill", b =>
                {
                    b.Property<int>("EmployeeId");

                    b.Property<int>("SkillId");

                    b.HasKey("EmployeeId", "SkillId");

                    b.HasIndex("SkillId");

                    b.ToTable("employee_skill");
                });

            modelBuilder.Entity("SkillsMatrix.Models.Skill", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("skill");
                });

            modelBuilder.Entity("SkillsMatrix.Models.EmployeeSkill", b =>
                {
                    b.HasOne("SkillsMatrix.Models.Employee", "Employee")
                        .WithMany("EmployeeSkills")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("SkillsMatrix.Models.Skill", "Skill")
                        .WithMany("SkillEmployees")
                        .HasForeignKey("SkillId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}

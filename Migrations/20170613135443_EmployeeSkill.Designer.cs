using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using SkillsMatrix.Models;

namespace SkillsMatrix.Migrations
{
    [DbContext(typeof(SkillsMatrixContext))]
    [Migration("20170613135443_EmployeeSkill")]
    partial class EmployeeSkill
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("SkillsMatrix.Models.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Employee");
                });

            modelBuilder.Entity("SkillsMatrix.Models.EmployeeSkill", b =>
                {
                    b.Property<int>("EmployeeId");

                    b.Property<int>("SkillId");

                    b.HasKey("EmployeeId", "SkillId");

                    b.HasIndex("SkillId");

                    b.ToTable("Employee_Skill");
                });

            modelBuilder.Entity("SkillsMatrix.Models.Skill", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Skill");
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

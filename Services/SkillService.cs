using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SkillsMatrix.Models;
using SkillsMatrix.Services.Interfaces;

namespace SkillsMatrix.Services
{
    public class SkillService: BaseService, IEntityService<Skill, int>
    {
        public SkillService(SkillsMatrixContext context)
            :base(context)
        {
        }

        public Skill Create(Skill entity)
        {
            db.Skills.Add(entity);
            List<EmployeeSkill> skillEmployees = entity.Employees.Select(e => new EmployeeSkill { SkillId = entity.Id, EmployeeId = e.Id }).ToList();
            db.Employee_Skill.AddRange(skillEmployees);
            db.SaveChanges();
            return entity;
        }

        public Skill Delete(int id)
        {
            var skill = db.Skills.Find(id);
            if (skill != null)
            {
                db.Skills.Remove(skill);
                db.SaveChanges();
            }

            return skill;
        }

        public IEnumerable<Skill> GetAll(string keywords = "", int page = 0, int pageSize = 10)
        {
            var offset = page * pageSize;
            IEnumerable<Skill> source = db.Skills;
            if (!String.IsNullOrEmpty(keywords)) {
                source = source.Where(s => s.Name.ToLower().Contains(keywords.ToLower()));
            }
            var skills = source.Skip(offset).Take(pageSize).ToList();
            return skills;
        }

        public Skill GetById(int id)
        {
            var skill = db.Skills
                .Include(s => s.SkillEmployees)
                .ThenInclude(es => es.Employee)
                .FirstOrDefault(s => s.Id == id);
                
            if (skill != null) {
                skill.Employees = skill.SkillEmployees.Select(es => es.Employee).ToList();
            }

            return skill;
        }

        public Skill Update(Skill entity)
        {
            var skill = GetById(entity.Id);
            if (skill != null)
            {
                skill.Name = entity.Name;
                List<EmployeeSkill> skillEmployees = entity.Employees.Select(e => new EmployeeSkill { SkillId = skill.Id, EmployeeId = e.Id }).ToList();
                Utils.UpdateDbSet(db.Employee_Skill, skillEmployees, skill.SkillEmployees, (a, b) => a.EmployeeId == b.EmployeeId && a.SkillId == b.SkillId);
                db.SaveChanges();
            }

            return skill;
        }
    }
}

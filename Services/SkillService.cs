using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SkillsMatrix.Models;

namespace SkillsMatrix.Services
{
    public partial class SkillService: BaseService
    {
        public SkillService(SkillsMatrixContext context)
            :base(context)
        {
        }
                
        public Skill GetById(int id)
        {
            var skill = db.Skills
                .Include(s => s.SkillEmployees)
                .ThenInclude(es => es.Employee)
                .Single(s => s.Id == id);
                
            skill.Employees = skill.SkillEmployees.Select(es => es.Employee).ToList();

            return skill;
        }
    }
}

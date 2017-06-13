using System.Collections.Generic;
using System.Runtime.Serialization;

namespace SkillsMatrix.Models
{
    [DataContract]
    public class Employee
    {
        [DataMember]
        public int Id {get; set;}

        [DataMember]
        public string Name {get; set;}

        public virtual ICollection<EmployeeSkill> EmployeeSkills { get; set; }

        [DataMember]
        public virtual ICollection<Skill> Skills { get; set; }
    }
}

using System.Collections.Generic;
using System.Runtime.Serialization;

namespace SkillsMatrix.Models
{
    [DataContract]
    public class Skill
    {
        [DataMember]
        public int Id {get; set;}

        [DataMember]
        public string Name {get; set;}

        public virtual ICollection<EmployeeSkill> SkillEmployees { get; set; }

        [DataMember]
        public virtual ICollection<Employee> Employees { get; set; }
    }
}

using SkillsMatrix.Models;

namespace SkillsMatrix.Commons
{
    public class BaseService
    {
        protected readonly SkillsMatrixContext db;

        public BaseService(SkillsMatrixContext context)
        {
            db = context;
        }
    }
}

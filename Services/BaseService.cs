using SkillsMatrix.Models;

namespace SkillsMatrix.Services
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

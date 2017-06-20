using Microsoft.EntityFrameworkCore;
using SkillsMatrix.Models;
using System.Collections.Generic;
using System;
using System.Linq;

namespace SkillsMatrix
{
    public static class Utils
    {
        public static void UpdateDbSet<T>(DbSet<T> dbSet, IEnumerable<T> additions, IEnumerable<T> deletions, Func<T,T,bool> comparer) where T : class {
            var intersection = additions.Where(addition => deletions.Any(deletion => comparer(addition, deletion))).ToList();
            additions = additions.Where(addition => !intersection.Any(common => comparer(addition, common))).ToList();
            deletions = deletions.Where(deletion => !intersection.Any(common => comparer(deletion, common))).ToList();
            
            dbSet.AddRange(additions);
            dbSet.RemoveRange(deletions);
        }
    }
}

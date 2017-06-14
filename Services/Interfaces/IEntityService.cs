using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SkillsMatrix.Models;

namespace SkillsMatrix.Services.Interfaces
{
    public interface IEntityService<T, TKey>
    {
        T Create(T entity);

        T Delete(TKey id);
        
        IEnumerable<T> GetAll(int page = 0, int pageSize = 10);

        T GetById(TKey id);

        T Update(T entity);
    }
}

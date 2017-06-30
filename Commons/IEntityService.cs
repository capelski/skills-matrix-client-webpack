using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SkillsMatrix.Models;

namespace SkillsMatrix.Commons
{
    public interface IEntityService<T, TKey>
    {
        T Create(T entity);

        T Delete(TKey id);
        
        PaginatedList<T> GetAll(string keywords = "", int page = 0, int pageSize = 10);

        T GetById(TKey id);

        T Update(T entity);
    }
}

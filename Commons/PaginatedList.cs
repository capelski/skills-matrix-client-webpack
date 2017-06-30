using System;
using System.Collections.Generic;

namespace SkillsMatrix.Commons
{
    public class PaginatedList<T>
    {
        public int CurrentPage { get; set; }

        public IEnumerable<T> Items { get; set; }

        public int TotalPages { get; set; }

        public int TotalRecords { get; set; }

        public PaginatedList(IEnumerable<T> items, int totalRecords, int page, int pageSize)
        {
            CurrentPage = page;
            Items = items;
            TotalPages = (int) Math.Ceiling((double) totalRecords / pageSize);
            TotalRecords = totalRecords;
        }
    }
}

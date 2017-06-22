using SkillsMatrix.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace SkillsMatrix.Commons
{
    public class GenericApiController<T, TKey, TService> : Controller
        where TService : IEntityService<T, TKey>
    {

        private IEntityService<T, TKey> _entityService {get; set;}

        public GenericApiController(IEntityService<T, TKey> entityService) {
            _entityService = entityService;
        }

        [HttpPost]
        public IActionResult Create([FromBody] T entity)
        {
            if (!CreateConditions(entity))
            {
                return BadRequest();
            }

            entity = _entityService.Create(entity);
            
            return Ok(entity);
        }

        protected virtual bool CreateConditions(T entity)
        {
            return entity != null;
        }
                
        [HttpDelete]
        public IActionResult Delete(TKey id)
        {
            var element = _entityService.Delete(id);
            if (element == null)
            {
                return NotFound();
            }
            
            return Ok(element);
        }
        
        [HttpGet]
        public IActionResult Get(string keywords = "", int page = 0, int pageSize = 10)
        {
            var list = _entityService.GetAll(keywords, page, pageSize);
            return Ok(list);
        }
                
        [HttpGet("getById")]
        public IActionResult GetById(TKey id)
        {
            var element = _entityService.GetById(id);            
            if (element == null)
            {
                return NotFound();
            }
            
            return Ok(element);
        }

        [HttpPut]
        public IActionResult Update([FromBody] T entity)
        {
            if (!UpdateConditions(entity))
            {
                return BadRequest();
            }

            var result = _entityService.Update(entity);
            if (result == null)
            {
                return NotFound();
            }
            
            return Ok(result);
        }

        protected virtual bool UpdateConditions(T entity)
        {
            return entity != null;
        }
    }
}

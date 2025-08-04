using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MStartBackend.Data;
using MStartBackend.Models;

namespace MStartBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            product.ServerDateTime = DateTime.Now;
            product.DateTimeUTC = DateTime.UtcNow;
            product.UpdateDateTimeUTC = DateTime.UtcNow;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.ID }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product updatedProduct)
        {
            if (id != updatedProduct.ID) return BadRequest();
            updatedProduct.UpdateDateTimeUTC = DateTime.UtcNow;
            _context.Entry(updatedProduct).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ChangeStatus(int id, [FromBody] string newStatus)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            product.Status = newStatus;
            product.UpdateDateTimeUTC = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}

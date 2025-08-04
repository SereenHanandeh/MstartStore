using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MStartBackend.Data;
using MStartBackend.Models;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : Controller
{
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        return await _context.Customers.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Customer>> GetCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();
        return customer;
    }

    [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomer(Customer customer)
    {
        customer.ServerDateTime = DateTime.Now;
        customer.DateTimeUTC = DateTime.UtcNow;

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.ID }, customer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, Customer updatedCustomer)
    {
        if (id != updatedCustomer.ID) return BadRequest();
        _context.Entry(updatedCustomer).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();
        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/upload-photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        customer.Photo = ms.ToArray();
        await _context.SaveChangesAsync();

        return Ok(new { message = "Photo uploaded successfully" });
    }

    [HttpPost("delete-multiple")]
    public async Task<IActionResult> DeleteMultiple([FromBody] List<int> ids)
    {
        var customers = await _context.Customers
            .Where(c => ids.Contains(c.ID))
            .ToListAsync();

        if (!customers.Any()) return NotFound();

        _context.Customers.RemoveRange(customers);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Deleted successfully" });
    }

    [HttpGet("{id}/order-summary")]
    public async Task<IActionResult> GetOrderSummary(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        var orders = await _context.Orders
            .Where(o => o.CustomerID == id)
            .ToListAsync();

        var totalAmount = orders.Sum(o => o.TotalAmount);
        var count = orders.Count;

        return Ok(new
        {
            OrderCount = count,
            TotalAmount = totalAmount
        });
    }

    [HttpGet("paged")]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomersPaged([FromQuery] int page = 1)
    {
        int pageSize = 10;
        var customers = await _context.Customers
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return customers;
    }


}

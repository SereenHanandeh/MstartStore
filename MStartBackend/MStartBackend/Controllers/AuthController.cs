using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MStartBackend.Data;
using MStartBackend.Models;
using MStartBackend.Models.auth;

[ApiController]
[Route("api/[controller]")]

    public class AuthController : Controller
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

    [HttpPost("register")]
    public async Task<IActionResult> Register(Register dto)
    {
        try
        {
            if (await _context.Customers.AnyAsync(c => c.Email == dto.Email))
                return BadRequest("Email already registered.");

            var customer = new Customer
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Gender = dto.Gender,
                DateOfBirth = DateTime.SpecifyKind(dto.DateOfBirth.Date, DateTimeKind.Utc),
                PasswordHash = PasswordHasher.HashPassword(dto.Password!),
                Status = "Active",
                ServerDateTime = DateTime.UtcNow,
                DateTimeUTC = DateTime.UtcNow,
                UpdateDateTimeUTC = DateTime.UtcNow,
                LastLoginDateTimeUTC = DateTime.MinValue
            };


            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registered successfully." });
        }
        catch (Exception ex)
        {
            var innerMessage = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, $"❌ Internal server error: {innerMessage}");
        }


    }



    [HttpPost("login")]
        public async Task<IActionResult> Login(Login dto)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == dto.Email);

            if (customer == null)
                return Unauthorized("Invalid credentials.");

            var hashedPassword = PasswordHasher.HashPassword(dto.Password!);
            if (customer.PasswordHash != hashedPassword)
                return Unauthorized("Invalid credentials.");

            customer.LastLoginDateTimeUTC = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Login successful.",
                customerId = customer.ID,
                name = customer.Name,
                status = customer.Status
            });
        }
    }


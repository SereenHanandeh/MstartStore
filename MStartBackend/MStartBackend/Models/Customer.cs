namespace MStartBackend.Models
{
    public class Customer
    {
        public int ID { get; set; }
        public DateTime? ServerDateTime { get; set; }
        public DateTime? DateTimeUTC { get; set; }
        public DateTime? UpdateDateTimeUTC { get; set; }
        public DateTime? LastLoginDateTimeUTC { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Status { get; set; } // Active, Inactive, Deleted, Expired
        public string? Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public byte[]? Photo { get; set; }

        public string? PasswordHash { get; set; }

        // علاقة مع الطلبات
        public ICollection<Order>? Orders { get; set; }
    }
}
